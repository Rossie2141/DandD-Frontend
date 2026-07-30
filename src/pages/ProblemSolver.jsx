import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { useNavigate } from 'react-router';

// 1. MUI Core Components
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

// 2. MUI Icons
import {
  PlayArrow,
  CloudUpload,
  Terminal,
  Description,
  History,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';

// Default boilerplates per language
const STARTER_CODE = {
  python: `def twoSum(nums: list[int], target: int) -> list[int]:
    hashmap = {}
    for i, n in enumerate(nums):
        diff = target - n
        if diff in hashmap:
            return [hashmap[diff], i]
        hashmap[n] = i
    return []`,
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
}`,
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

export default function ProblemSolver() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState(STARTER_CODE.python);
  const [leftTab, setLeftTab] = useState(0); // 0: Description, 1: Submissions
  const [bottomTab, setBottomTab] = useState(0); // 0: Testcases, 1: Result/Output
  
  // Execution state
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);
  
  // Submission history state
  const [submissions, setSubmissions] = useState([
    { id: 1, status: 'Accepted', lang: 'Python', runtime: '42 ms', memory: '16.4 MB', time: '10 mins ago' },
    { id: 2, status: 'Wrong Answer', lang: 'C++', runtime: 'N/A', memory: 'N/A', time: '1 hour ago' }
  ]);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    setCode(STARTER_CODE[newLang] || '');
  };

  // Step: Run Code -> View Output
  const handleRunCode = () => {
    setIsRunning(true);
    setBottomTab(1);

    setTimeout(() => {
      setIsRunning(false);
      setExecutionResult({
        type: 'run',
        status: 'Finished',
        stdout: '[0, 1]',
        expected: '[0, 1]',
        input: 'nums = [2,7,11,15], target = 9',
        runtime: '45 ms'
      });
    }, 1200);
  };

  // Step: Submit Solution -> Judge Execution -> Save Result / Failed Testcases -> Submission History
  const handleSubmit = () => {
    setIsSubmitting(true);
    setBottomTab(1);

    setTimeout(() => {
      setIsSubmitting(false);
      
      const isAccepted = true; 
      const newStatus = isAccepted ? 'Accepted' : 'Wrong Answer';

      setExecutionResult({
        type: 'submit',
        status: newStatus,
        passedCases: '3/3 Passed',
        runtime: '38 ms',
        memory: '15.2 MB',
        failedCase: isAccepted ? null : {
          input: 'nums = [3,2,4], target = 6',
          output: '[0, 1]',
          expected: '[1, 2]'
        }
      });

      setSubmissions((prev) => [
        {
          id: Date.now(),
          status: newStatus,
          lang: language.toUpperCase(),
          runtime: '38 ms',
          memory: '15.2 MB',
          time: 'Just now'
        },
        ...prev
      ]);
    }, 1800);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#f8fafc', color: '#0f172a' }}>
      
      {/* Top Navbar */}
      <Paper
        elevation={0}
        sx={{
          height: 52,
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
            onClick={() => navigate('/dashboard')}
            sx={{
              color: '#475569',
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.875rem',
              '&:hover': { color: '#0f172a', backgroundColor: '#f1f5f9' },
            }}
          >
            Dashboard
          </Button>
          <Divider orientation="vertical" flexItem sx={{ my: 1.5, borderColor: '#e2e8f0' }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.95rem' }}>
            1. Two Sum
          </Typography>
          <Chip
            label="Easy"
            size="small"
            sx={{
              height: 22,
              fontWeight: 600,
              fontSize: '0.75rem',
              color: '#16a34a',
              backgroundColor: '#f0fdf4',
              border: '1px solid #bbf7d0',
            }}
          />
        </Stack>

        {/* Action Controls */}
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Button
            variant="outlined"
            startIcon={isRunning ? <CircularProgress size={16} color="inherit" /> : <PlayArrow sx={{ fontSize: '18px !important' }} />}
            onClick={handleRunCode}
            disabled={isRunning || isSubmitting}
            sx={{
              borderColor: '#cbd5e1',
              color: '#334155',
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.875rem',
              borderRadius: '8px',
              py: 0.6,
              px: 2,
              '&:hover': { borderColor: '#0f172a', backgroundColor: '#f8fafc' },
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
              backgroundColor: '#0f172a',
              color: '#ffffff',
              fontWeight: 500,
              textTransform: 'none',
              fontSize: '0.875rem',
              borderRadius: '8px',
              py: 0.6,
              px: 2,
              '&:hover': { backgroundColor: '#1e293b' },
            }}
          >
            Submit
          </Button>
        </Stack>
      </Paper>

      {/* Main Split Body */}
      <Box sx={{ flexGrow: 1, display: 'flex', overflow: 'hidden', p: 1, gap: 1 }}>
        
        {/* LEFT PANEL: Problem Details / Submission History */}
        <Paper
          elevation={0}
          sx={{
            width: '45%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
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
              '& .MuiTabs-indicator': { backgroundColor: '#0f172a' },
            }}
          >
            <Tab icon={<Description sx={{ fontSize: 16 }} />} iconPosition="start" label="Description" />
            <Tab icon={<History sx={{ fontSize: 16 }} />} iconPosition="start" label="Submissions" />
          </Tabs>

          <Box sx={{ flexGrow: 1, p: 3, overflowY: 'auto' }}>
            {leftTab === 0 && (
              <Stack spacing={2.5}>
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#0f172a', fontSize: '1.25rem' }}>
                  Two Sum
                </Typography>

                <Typography variant="body2" sx={{ color: '#334155', lineHeight: 1.7, fontSize: '0.875rem' }}>
                  Given an array of integers <code>nums</code> and an integer <code>target</code>, return <i>indices of the two numbers such that they add up to <code>target</code></i>.
                  <br /><br />
                  You may assume that each input would have <b>exactly one solution</b>, and you may not use the same element twice. You can return the answer in any order.
                </Typography>

                <Divider sx={{ borderColor: '#f1f5f9' }} />

                {/* Test Examples */}
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#0f172a', fontSize: '0.875rem' }}>
                    Example 1:
                  </Typography>
                  <Box
                    sx={{
                      p: 2,
                      backgroundColor: '#f8fafc',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      fontFamily: 'monospace',
                      fontSize: '0.8125rem',
                      color: '#1e293b',
                      lineHeight: 1.6,
                    }}
                  >
                    <div><b>Input:</b> nums = [2,7,11,15], target = 9</div>
                    <div><b>Output:</b> [0,1]</div>
                    <div><b>Explanation:</b> Because nums[0] + nums[1] == 9, we return [0, 1].</div>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#0f172a', fontSize: '0.875rem' }}>
                    Example 2:
                  </Typography>
                  <Box
                    sx={{
                      p: 2,
                      backgroundColor: '#f8fafc',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      fontFamily: 'monospace',
                      fontSize: '0.8125rem',
                      color: '#1e293b',
                      lineHeight: 1.6,
                    }}
                  >
                    <div><b>Input:</b> nums = [3,2,4], target = 6</div>
                    <div><b>Output:</b> [1,2]</div>
                  </Box>
                </Box>

                {/* Constraints */}
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#0f172a', fontSize: '0.875rem' }}>
                    Constraints:
                  </Typography>
                  <Box component="ul" sx={{ pl: 2.5, color: '#475569', fontSize: '0.8125rem', lineHeight: 1.8 }}>
                    <li><code>2 &lt;= nums.length &lt;= 10⁴</code></li>
                    <li><code>-10⁹ &lt;= nums[i] &lt;= 10⁹</code></li>
                    <li><code>-10⁹ &lt;= target &lt;= 10⁹</code></li>
                    <li><b>Only one valid answer exists.</b></li>
                  </Box>
                </Box>
              </Stack>
            )}

            {/* Submission History */}
            {leftTab === 1 && (
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#0f172a', fontSize: '0.95rem' }}>
                  Submission History
                </Typography>
                <TableContainer component={Paper} elevation={0} sx={{ backgroundColor: 'transparent', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                  <Table size="small">
                    <TableHead sx={{ backgroundColor: '#f8fafc' }}>
                      <TableRow>
                        <TableCell sx={{ color: '#64748b', fontWeight: 600, borderBottom: '1px solid #e2e8f0', fontSize: '0.75rem' }}>Status</TableCell>
                        <TableCell sx={{ color: '#64748b', fontWeight: 600, borderBottom: '1px solid #e2e8f0', fontSize: '0.75rem' }}>Language</TableCell>
                        <TableCell sx={{ color: '#64748b', fontWeight: 600, borderBottom: '1px solid #e2e8f0', fontSize: '0.75rem' }}>Runtime</TableCell>
                        <TableCell sx={{ color: '#64748b', fontWeight: 600, borderBottom: '1px solid #e2e8f0', fontSize: '0.75rem' }}>Time</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {submissions.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell sx={{ borderBottom: '1px solid #f1f5f9' }}>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                                color: row.status === 'Accepted' ? '#16a34a' : '#ef4444',
                                fontWeight: 600,
                                fontSize: '0.8125rem',
                              }}
                            >
                              {row.status === 'Accepted' ? <CheckIcon fontSize="small" /> : <CancelIcon fontSize="small" />}
                              {row.status}
                            </Box>
                          </TableCell>
                          <TableCell sx={{ color: '#334155', borderBottom: '1px solid #f1f5f9', fontFamily: 'monospace', fontSize: '0.8125rem' }}>
                            {row.lang}
                          </TableCell>
                          <TableCell sx={{ color: '#334155', borderBottom: '1px solid #f1f5f9', fontSize: '0.8125rem' }}>
                            {row.runtime}
                          </TableCell>
                          <TableCell sx={{ color: '#64748b', borderBottom: '1px solid #f1f5f9', fontSize: '0.75rem' }}>
                            {row.time}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </Box>
        </Paper>

        {/* RIGHT PANEL: Code Editor & Console Drawer */}
        <Box sx={{ width: '55%', display: 'flex', flexDirection: 'column', gap: 1 }}>
          
          {/* Top Code Editor Container */}
          <Paper
            elevation={0}
            sx={{
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              overflow: 'hidden',
            }}
          >
            {/* Editor Header: Language Selector */}
            <Box
              sx={{
                px: 2,
                py: 0.75,
                backgroundColor: '#f8fafc',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Select
                value={language}
                onChange={handleLanguageChange}
                size="small"
                sx={{
                  height: 32,
                  color: '#0f172a',
                  backgroundColor: '#ffffff',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  borderRadius: '6px',
                  '& .MuiSelect-icon': { color: '#64748b' },
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#cbd5e1' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#94a3b8' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#0f172a' },
                }}
              >
                <MenuItem value="python">Python 3</MenuItem>
                <MenuItem value="javascript">JavaScript</MenuItem>
                <MenuItem value="cpp">C++</MenuItem>
                <MenuItem value="rust">Rust</MenuItem>
              </Select>
            </Box>

            {/* Monaco Code Editor */}
            <Box sx={{ flexGrow: 1, position: 'relative', py: 1 }}>
              <Editor
                height="100%"
                theme="vs"
                language={language === 'cpp' ? 'cpp' : language}
                value={code}
                onChange={(value) => setCode(value || '')}
                options={{
                  fontSize: 13.5,
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  padding: { top: 8 },
                  lineNumbersMinChars: 3,
                }}
              />
            </Box>
          </Paper>

          {/* Bottom Console / Output Section */}
          <Paper
            elevation={0}
            sx={{
              height: 220,
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
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
                '& .MuiTabs-indicator': { backgroundColor: '#0f172a' },
              }}
            >
              <Tab label="Testcase" />
              <Tab icon={<Terminal sx={{ fontSize: 16 }} />} iconPosition="start" label="Test Result / Output" />
            </Tabs>

            <Box sx={{ p: 2, flexGrow: 1, overflowY: 'auto', fontFamily: 'monospace', fontSize: '0.8125rem' }}>
              
              {/* Testcases Input Tab */}
              {bottomTab === 0 && (
                <Box>
                  <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 1, fontFamily: 'sans-serif', fontWeight: 500 }}>
                    Input Parameters:
                  </Typography>
                  <Box sx={{ p: 1.5, backgroundColor: '#f8fafc', borderRadius: '6px', color: '#0f172a', border: '1px solid #e2e8f0', lineHeight: 1.6 }}>
                    nums = [2,7,11,15]
                    <br />
                    target = 9
                  </Box>
                </Box>
              )}

              {/* Output Tab */}
              {bottomTab === 1 && (
                <Box>
                  {isRunning || isSubmitting ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#64748b', fontFamily: 'sans-serif' }}>
                      <CircularProgress size={18} sx={{ color: '#0f172a' }} />
                      Executing solution against test cases...
                    </Box>
                  ) : executionResult ? (
                    <Stack spacing={1.5}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            fontSize: '1rem',
                            color: executionResult.status === 'Accepted' || executionResult.status === 'Finished' ? '#16a34a' : '#ef4444',
                            fontFamily: 'sans-serif',
                          }}
                        >
                          {executionResult.status}
                        </Typography>
                        {executionResult.runtime && (
                          <Chip
                            label={`Runtime: ${executionResult.runtime}`}
                            size="small"
                            sx={{ backgroundColor: '#f1f5f9', color: '#334155', fontWeight: 500, fontSize: '0.75rem' }}
                          />
                        )}
                      </Box>

                      {/* Run Code View */}
                      {executionResult.type === 'run' && (
                        <Box sx={{ p: 1.5, backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0', lineHeight: 1.6 }}>
                          <div><span style={{ color: '#64748b' }}>Input:</span> {executionResult.input}</div>
                          <div><span style={{ color: '#64748b' }}>Output:</span> <span style={{ color: '#16a34a', fontWeight: 600 }}>{executionResult.stdout}</span></div>
                          <div><span style={{ color: '#64748b' }}>Expected:</span> {executionResult.expected}</div>
                        </Box>
                      )}

                      {/* Submit Failed View */}
                      {executionResult.failedCase && (
                        <Box sx={{ p: 1.5, backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', color: '#991b1b', lineHeight: 1.6 }}>
                          <Typography variant="caption" sx={{ color: '#dc2626', fontWeight: 600, display: 'block', mb: 0.5, fontFamily: 'sans-serif' }}>
                            Failed Test Case:
                          </Typography>
                          <div>Input: {executionResult.failedCase.input}</div>
                          <div>Output: {executionResult.failedCase.output}</div>
                          <div>Expected: {executionResult.failedCase.expected}</div>
                        </Box>
                      )}
                    </Stack>
                  ) : (
                    <Typography variant="body2" sx={{ color: '#64748b', fontFamily: 'sans-serif', fontSize: '0.875rem' }}>
                      Click "Run" or "Submit" to test your solution.
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}