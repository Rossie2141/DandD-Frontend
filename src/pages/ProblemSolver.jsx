import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { useNavigate, useLocation } from 'react-router';

// MUI Core Components
import {
  Box,
  Paper,
  Typography,
  Button,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Stack,
  Chip,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
} from '@mui/material';

// MUI Icons
import {
  PlayArrow,
  CloudUpload,
  Terminal,
  Description,
  History,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  ArrowBack as ArrowBackIcon,
  DragIndicator,
} from '@mui/icons-material';

const STARTER_CODE = {
  python: `def twoSum(nums: list[int], target: int) -> list[int]:
    hashmap = {}
    for i, n in enumerate(nums):
        diff = target - n
        if diff in hashmap:
            return [hashmap[diff], i]
        hashmap[n] = i
    return []

# Example execution to test locally:
# print(twoSum([2,7,11,15], 9))
`,
  javascript: `function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const diff = target - nums[i];
        if (map.has(diff)) {
            return [map.get(diff), i];
        }
        map.set(nums[i], i);
    }
    return [];
}

// Example execution to test locally:
// console.log(twoSum([2,7,11,15], 9));
`,
  cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> mp;
        for (int i = 0; i < nums.size(); i++) {
            int diff = target - nums[i];
            if (mp.count(diff)) return {mp[diff], i};
            mp[nums[i]] = i;
        }
        return {};
    }
};`,
  rust: `impl Solution {
    pub fn two_sum(nums: Vec<i32>, target: i32) -> Vec<i32> {
        use std::collections::HashMap;
        let mut map = HashMap::new();
        for (i, &num) in nums.iter().enumerate() {
            if let Some(&prev_i) = map.get(&(target - num)) {
                return vec![prev_i as i32, i as i32];
            }
            map.insert(num, i);
        }
        vec![]
    }
}`
};

const STATUS_COLOR = {
  Finished: '#16a34a',
  Accepted: '#16a34a',
  'Wrong Answer': '#ef4444',
  Error: '#ef4444',
};
const getStatusColor = (status) => STATUS_COLOR[status] || '#ef4444';

export default function ProblemSolver() {
  const navigate = useNavigate();
  const location = useLocation();
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState(STARTER_CODE.python);
  const [leftTab, setLeftTab] = useState(0); 
  const [bottomTab, setBottomTab] = useState('testcases'); // 'testcases' | 'output'
  const [activeTestCase, setActiveTestCase] = useState(0);

  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [executionResponse, setExecutionResponse] = useState(null);

  const [submissions, setSubmissions] = useState([
    { id: 1, status: 'Accepted', lang: 'PYTHON', runtime: '42 ms', time: '10 mins ago' },
  ]);

  const [problem, setProblem] = useState(null);
  const [loadingProblem, setLoadingProblem] = useState(true);
  const [problemError, setProblemError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('problemId');
    if (!id) {
      setLoadingProblem(false);
      setProblemError('Problem id not provided in query.');
      return;
    }

    setLoadingProblem(true);
    setProblemError(null);

    fetch(`http://localhost:8000/api/v1/problems/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setProblem(data);
        if (data?.starter_code) {
          setCode(data.starter_code);
        } else {
          setCode(STARTER_CODE[language] || '');
        }
      })
      .catch((err) => {
        setProblemError(err.message || 'Failed to load problem');
      })
      .finally(() => setLoadingProblem(false));
  }, [location.search]);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    if (newLang === 'python' && problem?.starter_code) {
      setCode(problem.starter_code);
    } else {
      setCode(STARTER_CODE[newLang] || '');
    }
  };

  const runExecution = async (testcases) => {
    const res = await fetch(`http://localhost:8000/api/v1/problems/${problem?.id || 1}/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language,
        code,
        testcases: testcases
      })
    });
    if (!res.ok) throw new Error(`Server returned ${res.status}`);
    return res.json();
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setBottomTab('output');
    
    // Send all example testcases
    const testcases = problem?.examples?.map(ex => ({
      input: ex.input,
      output: ex.output
    })) || [{ input: "nums = [2,7,11,15], target = 9", output: "[0,1]" }];

    try {
      const data = await runExecution(testcases);
      setExecutionResponse({
        type: 'run',
        status: data.status || 'Finished',
        results: data.results || [{
          status: data.status,
          input: testcases[0].input,
          expected: testcases[0].output,
          output: data.stdout || '',
          stdout: data.stdout || '',
          stderr: data.stderr || null,
          runtime: data.runtime || 'N/A'
        }],
        runtime: data.runtime || 'N/A'
      });
      // Switch to the first failed testcase if any, or stay on current
      if (data.results) {
        const firstFailed = data.results.findIndex(r => r.status !== 'Accepted');
        if (firstFailed !== -1) setActiveTestCase(firstFailed);
      }
    } catch (err) {
      setExecutionResponse({
        type: 'run',
        status: 'Error',
        results: [{ status: 'Error', stderr: 'Failed to connect to execution service' }],
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setBottomTab('output');
    const testcases = problem?.examples?.map(ex => ({
      input: ex.input,
      output: ex.output
    })) || [];

    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`http://localhost:8000/api/v1/problems/${problem?.id || 1}/submit`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          language,
          code,
          testcases: testcases
        })
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const data = await res.json();
      
      const newStatus = data.status || 'Accepted';

      setExecutionResponse({
        type: 'submit',
        status: newStatus,
        results: data.results,
        runtime: data.runtime || 'N/A'
      });

      setSubmissions((prev) => [
        {
          id: Date.now(),
          status: newStatus,
          lang: language.toUpperCase(),
          runtime: data.runtime || 'N/A',
          time: 'Just now'
        },
        ...prev
      ]);
    } catch (err) {
      setExecutionResponse({
        type: 'submit',
        status: 'Error',
        results: [{ status: 'Error', stderr: 'Failed to connect to backend' }],
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeResult = executionResponse?.results?.[activeTestCase];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: '#f8fafc', // Light mode background
        color: '#0f172a'
      }}
    >
      {/* Top Navbar */}
      <Paper
        elevation={0}
        sx={{
          minHeight: 52,
          py: 0,
          px: 2.5,
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderRadius: 0,
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/problems')}
            sx={{
              color: '#64748b',
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.875rem',
              '&:hover': { color: '#0f172a', backgroundColor: 'rgba(0,0,0,0.04)' },
            }}
          >
            Back to Problems
          </Button>
          
          <Divider orientation="vertical" flexItem sx={{ my: 1.5, borderColor: '#e2e8f0' }} />

          {loadingProblem ? (
            <CircularProgress size={18} sx={{ color: '#0f172a' }} />
          ) : problemError ? (
            <Typography variant="subtitle1" sx={{ color: '#ef4444', fontSize: '0.95rem' }}>
              Error loading problem
            </Typography>
          ) : (
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#0f172a', fontSize: '1rem' }}>
                 {problem?.title}
              </Typography>
              <Chip
                label={problem?.difficulty || '—'}
                size="small"
                sx={{
                  height: 22,
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  color: problem?.difficulty === 'Easy' ? '#16a34a' : problem?.difficulty === 'Medium' ? '#d97706' : '#dc2626',
                  backgroundColor: 'transparent',
                  border: `1px solid ${problem?.difficulty === 'Easy' ? '#16a34a' : problem?.difficulty === 'Medium' ? '#d97706' : '#dc2626'}`,
                }}
              />
            </Stack>
          )}
        </Stack>

        <Stack direction="row" spacing={1.5}>
          <Button
            variant="outlined"
            startIcon={isRunning ? <CircularProgress size={16} color="inherit" /> : <PlayArrow sx={{ fontSize: '18px !important' }} />}
            onClick={handleRunCode}
            disabled={isRunning || isSubmitting}
            sx={{
              borderColor: '#cbd5e1',
              color: '#0f172a',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.875rem',
              borderRadius: '6px',
              py: 0.5,
              px: 2,
              '&:hover': { borderColor: '#94a3b8', backgroundColor: 'rgba(0,0,0,0.04)' },
            }}
          >
            Run
          </Button>
          <Button
            variant="contained"
            disableElevation
            startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : <CloudUpload sx={{ fontSize: '18px !important' }} />}
            onClick={handleSubmit}
            disabled={isRunning || isSubmitting}
            sx={{
              backgroundColor: '#10b981', // green for submit
              color: '#ffffff',
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '0.875rem',
              borderRadius: '6px',
              py: 0.5,
              px: 2,
              '&:hover': { backgroundColor: '#059669' },
            }}
          >
            Submit
          </Button>
        </Stack>
      </Paper>

      {/* Main Split Body */}
      <Box sx={{ flexGrow: 1, p: 2, display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' }, overflow: 'hidden' }}>
        
        {/* LEFT COLUMN: Description & Submissions */}
        <Box sx={{ width: { xs: '100%', md: '45%' }, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <Paper
              elevation={0}
              sx={{
                height: '100%',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              <Tabs
                value={leftTab}
                onChange={(e, val) => setLeftTab(val)}
                sx={{
                  minHeight: 42,
                  backgroundColor: '#f8fafc',
                  borderBottom: '1px solid #e2e8f0',
                  '& .MuiTab-root': {
                    color: '#64748b',
                    minHeight: 42,
                    textTransform: 'none',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                  },
                  '& .Mui-selected': { color: '#0f172a', fontWeight: 600 },
                  '& .MuiTabs-indicator': { backgroundColor: '#3b82f6' }, // blue indicator
                }}
              >
                <Tab icon={<Description sx={{ fontSize: 16 }} />} iconPosition="start" label="Description" />
                <Tab icon={<History sx={{ fontSize: 16 }} />} iconPosition="start" label="Submissions" />
              </Tabs>

              <Box sx={{ flexGrow: 1, p: 3, overflowY: 'auto', color: '#475569' }}>
                {leftTab === 0 && (
                  <Stack spacing={3}>
                    <Typography variant="h5" sx={{ fontWeight: 600, color: '#0f172a', fontSize: '1.5rem' }}>
                      {problem?.title || 'Problem Description'}
                    </Typography>

                    <Typography variant="body1" sx={{ lineHeight: 1.8, fontSize: '0.95rem' }}>
                      {problem?.description}
                    </Typography>

                    <Divider sx={{ borderColor: '#e2e8f0' }} />

                    {problem?.examples?.map((ex, idx) => (
                      <Box key={idx}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: '#0f172a' }}>
                          Example {idx + 1}:
                        </Typography>
                        <Box
                          sx={{
                            p: 2,
                            backgroundColor: '#f8fafc',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            fontFamily: "'Fira Code', monospace",
                            fontSize: '0.85rem',
                            color: '#334155',
                            lineHeight: 1.7,
                          }}
                        >
                          <div><strong style={{color: '#0f172a'}}>Input:</strong> {ex.input}</div>
                          <div><strong style={{color: '#0f172a'}}>Output:</strong> {ex.output}</div>
                          {ex.explanation && <div style={{marginTop: 8}}><strong style={{color: '#0f172a'}}>Explanation:</strong> {ex.explanation}</div>}
                        </Box>
                      </Box>
                    ))}

                    {problem?.constraints && (
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: '#0f172a' }}>
                          Constraints:
                        </Typography>
                        <Box component="ul" sx={{ pl: 2.5, fontSize: '0.85rem', lineHeight: 2, fontFamily: "'Fira Code', monospace" }}>
                          {problem.constraints.split('\\n').map((line, idx) => (
                            <li key={idx}>
                              <Box component="span" sx={{ backgroundColor: '#f1f5f9', color: '#334155', px: 1, py: 0.2, borderRadius: '4px' }}>
                                {line}
                              </Box>
                            </li>
                          ))}
                        </Box>
                      </Box>
                    )}
                  </Stack>
                )}

                {leftTab === 1 && (
                  <Box>
                    <TableContainer component={Paper} elevation={0} sx={{ backgroundColor: 'transparent' }}>
                      <Table size="small">
                        <TableHead sx={{ backgroundColor: '#f8fafc' }}>
                          <TableRow>
                            <TableCell sx={{ color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>Status</TableCell>
                            <TableCell sx={{ color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>Language</TableCell>
                            <TableCell sx={{ color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>Runtime</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {submissions.map((row) => (
                            <TableRow key={row.id}>
                              <TableCell sx={{ borderBottom: '1px solid #e2e8f0' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: getStatusColor(row.status), fontWeight: 600 }}>
                                  {row.status === 'Accepted' || row.status === 'Finished' ? <CheckIcon fontSize="small" /> : <CancelIcon fontSize="small" />}
                                  {row.status}
                                </Box>
                              </TableCell>
                              <TableCell sx={{ color: '#334155', borderBottom: '1px solid #e2e8f0' }}>{row.lang}</TableCell>
                              <TableCell sx={{ color: '#334155', borderBottom: '1px solid #e2e8f0' }}>{row.runtime}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                )}
              </Box>
            </Paper>
        </Box>

        {/* RIGHT COLUMN: Editor & Output */}
        <Box sx={{ width: { xs: '100%', md: '55%' }, display: 'flex', flexDirection: 'column', gap: 2, minHeight: 0 }}>
          
          {/* Top Code Editor Container */}
          <Box sx={{ flexGrow: 1, minHeight: { xs: '350px', md: 0 }, display: 'flex', flexDirection: 'column' }}>
                <Paper
                  elevation={0}
                  sx={{
                    flexGrow: 1,
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      px: 2,
                      py: 0.75,
                      backgroundColor: '#f8fafc',
                      borderBottom: '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Select
                      value={language}
                      onChange={handleLanguageChange}
                      size="small"
                      sx={{
                        height: 28,
                        color: '#0f172a',
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        borderRadius: '4px',
                        '& .MuiSelect-icon': { color: '#64748b' },
                        '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                        '&:hover': { backgroundColor: '#f1f5f9' },
                      }}
                    >
                      <MenuItem value="python">Python 3</MenuItem>
                      <MenuItem value="javascript">JavaScript</MenuItem>
                      <MenuItem value="cpp">C++</MenuItem>
                      <MenuItem value="rust">Rust</MenuItem>
                    </Select>
                  </Box>

                  <Box sx={{ flexGrow: 1, position: 'relative', pt: 1 }}>
                    <Editor
                      height="100%"
                      theme="light"
                      language={language === 'cpp' ? 'cpp' : language}
                      value={code}
                      onChange={(value) => setCode(value || '')}
                      options={{
                        fontSize: 14,
                        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        padding: { top: 8 },
                      }}
                    />
                  </Box>
                </Paper>
          </Box>

          {/* Bottom Console / Output Section */}
          <Box sx={{ height: 280, minHeight: 280, display: 'flex', flexDirection: 'column' }}>
                <Paper
                  elevation={0}
                  sx={{
                    flexGrow: 1,
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                  }}
                >
                  <Tabs
                    value={bottomTab}
                    onChange={(e, val) => setBottomTab(val)}
                    sx={{
                      minHeight: 38,
                      backgroundColor: '#f8fafc',
                      borderBottom: '1px solid #e2e8f0',
                      '& .MuiTab-root': {
                        color: '#64748b',
                        minHeight: 38,
                        textTransform: 'none',
                        fontSize: '0.8125rem',
                        fontWeight: 500,
                      },
                      '& .Mui-selected': { color: '#0f172a', fontWeight: 600 },
                      '& .MuiTabs-indicator': { backgroundColor: '#3b82f6' },
                    }}
                  >
                    <Tab value="testcases" icon={<CheckIcon sx={{ fontSize: 16 }} />} iconPosition="start" label="Testcases" />
                    <Tab value="output" icon={<Terminal sx={{ fontSize: 16 }} />} iconPosition="start" label="Test Result" />
                  </Tabs>

                  <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    
                    {/* Testcases Tab */}
                    {bottomTab === 'testcases' && (
                      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <Stack direction="row" spacing={1} mb={2}>
                          {problem?.examples?.map((ex, idx) => (
                            <Chip
                              key={idx}
                              label={`Case ${idx + 1}`}
                              onClick={() => setActiveTestCase(idx)}
                              sx={{
                                backgroundColor: activeTestCase === idx ? '#e2e8f0' : 'transparent',
                                color: activeTestCase === idx ? '#0f172a' : '#64748b',
                                border: '1px solid',
                                borderColor: activeTestCase === idx ? '#cbd5e1' : 'transparent',
                                borderRadius: '6px',
                                fontWeight: activeTestCase === idx ? 600 : 400,
                                '&:hover': { backgroundColor: '#f1f5f9' }
                              }}
                            />
                          ))}
                        </Stack>

                        <Box sx={{ overflowY: 'auto', flexGrow: 1 }}>
                          <Typography variant="caption" sx={{ color: '#64748b', mb: 0.5, display: 'block', fontWeight: 600 }}>
                            Input:
                          </Typography>
                          <Box sx={{ p: 1.5, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', mb: 2, fontFamily: 'monospace', color: '#334155' }}>
                            {problem?.examples?.[activeTestCase]?.input}
                          </Box>

                          <Typography variant="caption" sx={{ color: '#64748b', mb: 0.5, display: 'block', fontWeight: 600 }}>
                            Expected Output:
                          </Typography>
                          <Box sx={{ p: 1.5, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', fontFamily: 'monospace', color: '#334155' }}>
                            {problem?.examples?.[activeTestCase]?.output}
                          </Box>
                        </Box>
                      </Box>
                    )}

                    {/* Output Tab */}
                    {bottomTab === 'output' && (
                      <Box sx={{ p: 2, overflowY: 'auto', height: '100%' }}>
                        {isRunning || isSubmitting ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#64748b' }}>
                            <CircularProgress size={18} sx={{ color: '#3b82f6' }} />
                            Evaluating...
                          </Box>
                        ) : executionResponse ? (
                          <Box>
                            <Typography
                              variant="h5"
                              sx={{
                                fontWeight: 700,
                                mb: 2,
                                color: getStatusColor(executionResponse.status),
                              }}
                            >
                              {executionResponse.status}
                            </Typography>
                            
                            {executionResponse.results && (
                              <Stack direction="row" spacing={1} mb={2} sx={{ overflowX: 'auto', pb: 1 }}>
                                {executionResponse.results.map((res, idx) => (
                                  <Chip
                                    key={idx}
                                    label={`Case ${idx + 1}`}
                                    onClick={() => setActiveTestCase(idx)}
                                    icon={res.status === 'Accepted' ? <CheckIcon style={{color: '#16a34a'}}/> : <CancelIcon style={{color: '#ef4444'}}/>}
                                    sx={{
                                      backgroundColor: activeTestCase === idx ? '#e2e8f0' : 'transparent',
                                      color: activeTestCase === idx ? '#0f172a' : '#64748b',
                                      border: '1px solid',
                                      borderColor: activeTestCase === idx ? '#cbd5e1' : 'transparent',
                                      borderRadius: '6px',
                                      fontWeight: activeTestCase === idx ? 600 : 400,
                                    }}
                                  />
                                ))}
                              </Stack>
                            )}

                            {activeResult ? (
                              <Stack spacing={2} sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                                <Box>
                                  <Typography variant="caption" sx={{ color: '#64748b', mb: 0.5, display: 'block', fontWeight: 600 }}>Input:</Typography>
                                  <Box sx={{ p: 1.5, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', color: '#334155' }}>
                                    {activeResult.input}
                                  </Box>
                                </Box>
                                <Box>
                                  <Typography variant="caption" sx={{ color: '#64748b', mb: 0.5, display: 'block', fontWeight: 600 }}>Output:</Typography>
                                  <Box sx={{ p: 1.5, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', color: activeResult.status === 'Accepted' ? '#16a34a' : '#ef4444', fontWeight: 600 }}>
                                    {activeResult.output || '(No output)'}
                                  </Box>
                                </Box>
                                <Box>
                                  <Typography variant="caption" sx={{ color: '#64748b', mb: 0.5, display: 'block', fontWeight: 600 }}>Expected:</Typography>
                                  <Box sx={{ p: 1.5, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', color: '#334155' }}>
                                    {activeResult.expected}
                                  </Box>
                                </Box>
                                {activeResult.stderr && (
                                  <Box>
                                    <Typography variant="caption" sx={{ color: '#ef4444', mb: 0.5, display: 'block', fontWeight: 600 }}>Error:</Typography>
                                    <Box sx={{ p: 1.5, backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', color: '#ef4444', whiteSpace: 'pre-wrap' }}>
                                      {activeResult.stderr}
                                    </Box>
                                  </Box>
                                )}
                              </Stack>
                            ) : (
                              <Typography sx={{ color: '#64748b' }}>Select a testcase to view details.</Typography>
                            )}
                          </Box>
                        ) : (
                          <Typography variant="body2" sx={{ color: '#64748b', mt: 2 }}>
                            Run code to see results here.
                          </Typography>
                        )}
                      </Box>
                    )}
                  </Box>
                </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}