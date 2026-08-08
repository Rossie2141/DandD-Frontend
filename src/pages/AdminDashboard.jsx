import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  Stack,
  IconButton,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Save as SaveIcon } from '@mui/icons-material';

// Uniform input styles for clean text contrast and smooth borders
const fieldStyle = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    color: '#0f172a',
    fontSize: '0.875rem',
    '& fieldset': {
      borderColor: '#e2e8f0',
      transition: 'border-color 0.2s ease',
    },
    '&:hover fieldset': {
      borderColor: '#cbd5e1',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#0f172a',
      borderWidth: '1.5px',
    },
  },
  '& .MuiInputBase-input::placeholder': {
    color: '#94a3b8',
    opacity: 1,
  },
};

// Monospace variant for code/constraints
const monoFieldStyle = {
  ...fieldStyle,
  '& .MuiOutlinedInput-root': {
    ...fieldStyle['& .MuiOutlinedInput-root'],
    fontFamily: 'monospace, "JetBrains Mono", Consolas',
    fontSize: '0.85rem',
  },
};

// Reusable Top Label Component
const FormLabel = ({ children, required }) => (
  <Typography
    variant="body2"
    sx={{
      fontWeight: 600,
      color: '#1e293b',
      mb: 0.75,
      fontSize: '0.875rem',
      display: 'flex',
      alignItems: 'center',
    }}
  >
    {children}
    {required && (
      <Box component="span" sx={{ color: '#ef4444', ml: 0.5 }}>
        *
      </Box>
    )}
  </Typography>
);

export default function AdminDashboard() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user.email === 'admin@example.com') {
          setIsAdmin(true);
        }
      } catch (e) {
        console.error("Failed to parse user data");
      }
    }
    setIsCheckingAuth(false);
  }, []);

  const [formData, setFormData] = useState({
    title: '',
    difficulty: 'Easy',
    category: '',
    description: '',
    constraints: '',
    starter_code: '',
  });

  const [examples, setExamples] = useState([
    { input: '', output: '', explanation: '' }
  ]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleExampleChange = (index, field, value) => {
    const newExamples = [...examples];
    newExamples[index][field] = value;
    setExamples(newExamples);
  };

  const addExample = () => {
    setExamples([...examples, { input: '', output: '', explanation: '' }]);
  };

  const removeExample = (index) => {
    const newExamples = examples.filter((_, i) => i !== index);
    setExamples(newExamples);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(null);

    const payload = {
      ...formData,
      examples: examples,
    };

    try {
      const response = await fetch('http://localhost:8000/api/v1/problems/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || 'Failed to create problem');
      }

      setSuccess(true);
      setFormData({
        title: '',
        difficulty: 'Easy',
        category: '',
        description: '',
        constraints: '',
        starter_code: '',
      });
      setExamples([{ input: '', output: '', explanation: '' }]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAdmin) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' }}>
        <Paper elevation={0} sx={{ p: 5, borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center', maxWidth: 400 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f172a', mb: 2 }}>
            Access Denied
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b' }}>
            You do not have permission to view the Admin Dashboard.
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc', py: { xs: 3, md: 5 }, px: { xs: 2, md: 4 } }}>
      <Paper
        elevation={0}
        sx={{
          maxWidth: 900,
          mx: 'auto',
          p: { xs: 2.5, sm: 4 },
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          backgroundColor: '#ffffff',
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5, color: '#0f172a', letterSpacing: '-0.02em' }}>
          Create New Problem
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b', mb: 4 }}>
          Add a new coding problem to the database. Driver code will be generated automatically.
        </Typography>

        {success && (
          <Alert severity="success" sx={{ mb: 3, borderRadius: '8px' }}>
            Problem created successfully!
          </Alert>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: '8px' }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {/* Title & Difficulty Row */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="flex-start">
              <Box sx={{ flex: 1, width: '100%' }}>
                <FormLabel required>Problem Title</FormLabel>
                <TextField
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Two Sum"
                  fullWidth
                  required
                  size="small"
                  sx={fieldStyle}
                />
              </Box>

              <Box sx={{ minWidth: { sm: 160 }, width: { xs: '100%', sm: 'auto' } }}>
                <FormLabel required>Difficulty</FormLabel>
                <FormControl fullWidth size="small">
                  <Select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleChange}
                    sx={{
                      color: '#0f172a',
                      fontWeight: 500,
                      fontSize: '0.875rem',
                      backgroundColor: '#f8fafc',
                      borderRadius: '8px',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#cbd5e1' },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#0f172a', borderWidth: '1.5px' },
                      '& .MuiSelect-icon': { color: '#0f172a' },
                    }}
                  >
                    <MenuItem value="Easy" sx={{ color: '#0f172a' }}>Easy</MenuItem>
                    <MenuItem value="Medium" sx={{ color: '#0f172a' }}>Medium</MenuItem>
                    <MenuItem value="Hard" sx={{ color: '#0f172a' }}>Hard</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Stack>

            {/* Category */}
            <Box>
              <FormLabel required>Category</FormLabel>
              <TextField
                name="category"
                value={formData.category}
                onChange={handleChange}
                fullWidth
                required
                size="small"
                placeholder="e.g. Arrays, Strings, Dynamic Programming"
                sx={fieldStyle}
              />
            </Box>

            {/* Description */}
            <Box>
              <FormLabel required>Description (Markdown supported)</FormLabel>
              <TextField
                name="description"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                required
                multiline
                rows={4}
                placeholder="Write problem statement here..."
                sx={fieldStyle}
              />
            </Box>

            {/* Constraints */}
            <Box>
              <FormLabel>Constraints (Newline separated)</FormLabel>
              <TextField
                name="constraints"
                value={formData.constraints}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
                placeholder={"1 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9"}
                sx={monoFieldStyle}
              />
            </Box>

            {/* Starter Code */}
            <Box>
              <FormLabel required>Starter Code (Python)</FormLabel>
              <TextField
                name="starter_code"
                value={formData.starter_code}
                onChange={handleChange}
                fullWidth
                required
                multiline
                rows={6}
                placeholder={"def myFunction(nums, target):\n    pass"}
                sx={monoFieldStyle}
              />
            </Box>

            <Divider sx={{ my: 1, borderColor: '#e2e8f0' }} />

            {/* Test Cases Header */}
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#0f172a', fontSize: '1.125rem' }}>
              Test Cases (Examples)
            </Typography>

            {/* Test Case Cards */}
            {examples.map((example, index) => (
              <Paper
                key={index}
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 3 },
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  backgroundColor: '#ffffff',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#0f172a' }}>
                    Example {index + 1}
                  </Typography>
                  <IconButton
                    onClick={() => removeExample(index)}
                    disabled={examples.length === 1}
                    size="small"
                    sx={{
                      color: '#ef4444',
                      '&.Mui-disabled': { color: '#cbd5e1' },
                      '&:hover': { backgroundColor: '#fee2e2' },
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>

                <Stack spacing={2}>
                  <Box>
                    <FormLabel required>Input</FormLabel>
                    <TextField
                      value={example.input}
                      onChange={(e) => handleExampleChange(index, 'input', e.target.value)}
                      required
                      fullWidth
                      size="small"
                      placeholder="nums = [2,7,11,15], target = 9"
                      sx={monoFieldStyle}
                    />
                  </Box>

                  <Box>
                    <FormLabel required>Output</FormLabel>
                    <TextField
                      value={example.output}
                      onChange={(e) => handleExampleChange(index, 'output', e.target.value)}
                      required
                      fullWidth
                      size="small"
                      placeholder="[0, 1]"
                      sx={monoFieldStyle}
                    />
                  </Box>

                  <Box>
                    <FormLabel>Explanation (Optional)</FormLabel>
                    <TextField
                      value={example.explanation}
                      onChange={(e) => handleExampleChange(index, 'explanation', e.target.value)}
                      fullWidth
                      size="small"
                      multiline
                      rows={2}
                      placeholder="Because nums[0] + nums[1] == 9, we return [0, 1]."
                      sx={fieldStyle}
                    />
                  </Box>
                </Stack>
              </Paper>
            ))}

            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={addExample}
              sx={{
                alignSelf: 'flex-start',
                textTransform: 'none',
                borderColor: '#e2e8f0',
                color: '#0f172a',
                fontWeight: 600,
                borderRadius: '8px',
                px: 2,
                py: 1,
                '&:hover': {
                  borderColor: '#0f172a',
                  backgroundColor: '#f1f5f9',
                },
              }}
            >
              Add Another Example
            </Button>

            <Divider sx={{ my: 1, borderColor: '#e2e8f0' }} />

            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
              sx={{
                py: 1.5,
                backgroundColor: '#0f172a',
                color: '#ffffff',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: '8px',
                boxShadow: 'none',
                fontSize: '0.9375rem',
                '&:hover': {
                  backgroundColor: '#1e293b',
                  boxShadow: 'none',
                },
              }}
            >
              {loading ? 'Saving Problem...' : 'Save Problem'}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}