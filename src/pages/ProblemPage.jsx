import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router';
import {
  Box,
  Typography,
  Container,
  Paper,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
} from '@mui/material';

// Icons using Material Symbols
const SearchIcon = () => (
  <span className="material-symbols-outlined" style={{ color: '#64748b' }}>
    search
  </span>
);
const ShuffleIcon = () => (
  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
    shuffle
  </span>
);
const CheckCircleIcon = () => (
  <span className="material-symbols-outlined" style={{ color: '#10b981', fontSize: '20px' }}>
    check_circle
  </span>
);
const UncheckedIcon = () => (
  <span className="material-symbols-outlined" style={{ color: '#cbd5e1', fontSize: '20px' }}>
    radio_button_unchecked
  </span>
);
const ArrowForwardIcon = () => (
  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
    arrow_forward
  </span>
);

// Sample dataset
const MOCK_PROBLEMS = [
  { id: 1, title: 'Two Sum', difficulty: 'Easy', category: 'Arrays', acceptance: '51.2%', solved: true, premium: false },
  { id: 2, title: 'Add Two Numbers', difficulty: 'Medium', category: 'Linked List', acceptance: '42.8%', solved: true, premium: false },
  { id: 3, title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', category: 'Sliding Window', acceptance: '34.5%', solved: false, premium: false },
  { id: 4, title: 'Median of Two Sorted Arrays', difficulty: 'Hard', category: 'Binary Search', acceptance: '38.1%', solved: false, premium: true },
  { id: 5, title: 'Longest Palindromic Substring', difficulty: 'Medium', category: 'String', acceptance: '33.2%', solved: false, premium: false },
  { id: 6, title: 'Zigzag Conversion', difficulty: 'Medium', category: 'String', acceptance: '46.7%', solved: false, premium: false },
  { id: 7, title: 'Reverse Integer', difficulty: 'Medium', category: 'Math', acceptance: '28.3%', solved: true, premium: false },
  { id: 8, title: 'String to Integer (atoi)', difficulty: 'Medium', category: 'String', acceptance: '17.4%', solved: false, premium: false },
  { id: 9, title: 'Palindrome Number', difficulty: 'Easy', category: 'Math', acceptance: '55.6%', solved: true, premium: false },
  { id: 10, title: 'Container With Most Water', difficulty: 'Medium', category: 'Two Pointers', acceptance: '54.9%', solved: false, premium: false },
  { id: 11, title: 'Trapping Rain Water', difficulty: 'Hard', category: 'Two Pointers', acceptance: '60.4%', solved: false, premium: false },
  { id: 12, title: 'Valid Parentheses', difficulty: 'Easy', category: 'Stack', acceptance: '40.8%', solved: true, premium: false },
  { id: 13, title: 'Merge Intervals', difficulty: 'Medium', category: 'Arrays', acceptance: '47.0%', solved: true, premium: false },
  { id: 14, title: 'Group Anagrams', difficulty: 'Medium', category: 'String', acceptance: '67.8%', solved: true, premium: false },
  { id: 15, title: 'Maximum Subarray', difficulty: 'Medium', category: 'Arrays', acceptance: '50.5%', solved: false, premium: false },
  { id: 16, title: 'Climbing Stairs', difficulty: 'Easy', category: 'Dynamic Programming', acceptance: '52.3%', solved: true, premium: false },
  { id: 17, title: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', category: 'Arrays', acceptance: '53.9%', solved: true, premium: false },
  { id: 18, title: 'Word Search', difficulty: 'Medium', category: 'Backtracking', acceptance: '40.9%', solved: false, premium: false },
  { id: 19, title: 'Merge k Sorted Lists', difficulty: 'Hard', category: 'Linked List', acceptance: '51.4%', solved: false, premium: true },
  { id: 20, title: 'Valid Sudoku', difficulty: 'Medium', category: 'Arrays', acceptance: '59.3%', solved: false, premium: false },
  { id: 21, title: 'Combination Sum', difficulty: 'Medium', category: 'Backtracking', acceptance: '70.2%', solved: false, premium: false },
  { id: 22, title: 'Permutations', difficulty: 'Medium', category: 'Backtracking', acceptance: '77.7%', solved: true, premium: false },
  { id: 23, title: 'Rotate Image', difficulty: 'Medium', category: 'Arrays', acceptance: '74.1%', solved: false, premium: false },
  { id: 24, title: 'Binary Tree Inorder Traversal', difficulty: 'Easy', category: 'Trees', acceptance: '75.2%', solved: true, premium: false },
  { id: 25, title: 'Validate Binary Search Tree', difficulty: 'Medium', category: 'Trees', acceptance: '32.6%', solved: false, premium: false },
  { id: 26, title: 'Symmetric Tree', difficulty: 'Easy', category: 'Trees', acceptance: '55.8%', solved: true, premium: false },
  { id: 27, title: 'Binary Tree Level Order Traversal', difficulty: 'Medium', category: 'Trees', acceptance: '66.4%', solved: true, premium: false },
  { id: 28, title: 'Maximum Depth of Binary Tree', difficulty: 'Easy', category: 'Trees', acceptance: '74.9%', solved: true, premium: false },
  { id: 29, title: 'Construct Binary Tree from Preorder and Inorder Traversal', difficulty: 'Medium', category: 'Trees', acceptance: '62.5%', solved: false, premium: false },
  { id: 30, title: 'Course Schedule', difficulty: 'Medium', category: 'Graphs', acceptance: '46.7%', solved: false, premium: false },
  { id: 31, title: 'Number of Islands', difficulty: 'Medium', category: 'Graphs', acceptance: '59.1%', solved: true, premium: false },
  { id: 32, title: 'Clone Graph', difficulty: 'Medium', category: 'Graphs', acceptance: '55.6%', solved: false, premium: true },
];

const CATEGORIES = ['All', 'Arrays', 'String', 'Linked List', 'Binary Search', 'Two Pointers', 'Stack', 'Math', 'Sliding Window', 'Dynamic Programming', 'Backtracking', 'Trees', 'Graphs'];

export default function ProblemsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Dynamic search and filter logic
  const filteredProblems = useMemo(() => {
    return MOCK_PROBLEMS.filter((problem) => {
      const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || problem.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'All' || problem.difficulty === selectedDifficulty;
      const matchesStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Solved' && problem.solved) ||
        (statusFilter === 'Unsolved' && !problem.solved);

      return matchesSearch && matchesCategory && matchesDifficulty && matchesStatus;
    });
  }, [searchQuery, selectedCategory, selectedDifficulty, statusFilter]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedCategory, selectedDifficulty, statusFilter]);

  const totalPages = Math.ceil(filteredProblems.length / ITEMS_PER_PAGE);
  const paginatedProblems = filteredProblems.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const getDifficultyChip = (difficulty) => {
    let styles = { bg: '#e2e8f0', color: '#475569' };
    if (difficulty === 'Easy') styles = { bg: '#d1fae5', color: '#065f46' };
    if (difficulty === 'Medium') styles = { bg: '#fef3c7', color: '#92400e' };
    if (difficulty === 'Hard') styles = { bg: '#ffe4e6', color: '#9f1239' };

    return (
      <Chip
        label={difficulty}
        size="small"
        sx={{
          backgroundColor: styles.bg,
          color: styles.color,
          fontWeight: 600,
          fontSize: '0.75rem',
          height: '24px',
        }}
      />
    );
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc', py: { xs: 2, sm: 3, md: 4 }, px: { xs: 1.5, sm: 3, md: 4 } }}>
      <Container maxWidth="lg" disableGutters={{ xs: false, sm: false }}>
        {/* Title & Quick Stats Section */}
        <Box
          sx={{
            mb: { xs: 2.5, sm: 3, md: 4 },
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'stretch', md: 'center' },
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em', fontSize: { xs: '1.5rem', sm: '1.875rem', md: '2.25rem' } }}>
              Problem Set
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
              Level up your algorithms, data structures, and problem-solving abilities.
            </Typography>
          </Box>

          {/* Metric Bar */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center',
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              width: { xs: '100%', md: 'auto' },
            }}
          >
            <Box sx={{ textAlign: 'center', flex: { xs: 1, md: 'initial' } }}>
              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
                Solved
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#10b981', lineHeight: 1.2 }}>
                5 / 12
              </Typography>
            </Box>
            <Box sx={{ height: '28px', width: '1px', backgroundColor: '#e2e8f0', mx: { xs: 1, md: 2 } }} />
            <Box sx={{ textAlign: 'center', flex: { xs: 1, md: 'initial' } }}>
              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
                Acceptance
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>
                62.5%
              </Typography>
            </Box>
          </Paper>
        </Box>

        {/* Category Pills Slider */}
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            overflowX: 'auto',
            pb: 1.5,
            mb: 2.5,
            '&::-webkit-scrollbar': { height: '4px' },
            '&::-webkit-scrollbar-thumb': { backgroundColor: '#cbd5e1', borderRadius: '4px' },
          }}
        >
          {CATEGORIES.map((cat) => (
            <Chip
              key={cat}
              label={cat}
              clickable
              onClick={() => setSelectedCategory(cat)}
              sx={{
                fontWeight: 500,
                fontSize: '0.8125rem',
                backgroundColor: selectedCategory === cat ? '#0f172a' : '#ffffff',
                color: selectedCategory === cat ? '#ffffff' : '#64748b',
                border: '1px solid',
                borderColor: selectedCategory === cat ? '#0f172a' : '#e2e8f0',
                whiteSpace: 'nowrap',
                '&:hover': {
                  backgroundColor: selectedCategory === cat ? '#1e293b' : '#f1f5f9',
                },
              }}
            />
          ))}
        </Box>

        {/* Filter Controls Card */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 2.5 },
            mb: 3,
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2,
            alignItems: 'center',
          }}
        >
          {/* Search Field */}
          <TextField
            placeholder="Search problems by title or topic..."
            size="small"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiInputBase-input': {
                color: '#0f172a',
                fontSize: '0.875rem',
              },
              '& .MuiInputBase-input::placeholder': {
                color: '#94a3b8',
                opacity: 1,
              },
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                '& fieldset': { borderColor: '#e2e8f0' },
                '&:hover fieldset': { borderColor: '#cbd5e1' },
                '&.Mui-focused fieldset': { borderColor: '#0f172a' },
              },
            }}
          />

          {/* Dropdowns Container for Tablet / Mobile layout */}
          <Box sx={{ display: 'flex', width: { xs: '100%', md: 'auto' }, gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            {/* Difficulty Dropdown */}
            <FormControl size="small" sx={{ minWidth: { sm: 150 }, width: '100%' }}>
              <Select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                sx={{
                  color: '#0f172a',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#cbd5e1' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#0f172a' },
                  '& .MuiSelect-icon': { color: '#0f172a' },
                }}
              >
                <MenuItem value="All" sx={{ color: '#0f172a' }}>All Difficulties</MenuItem>
                <MenuItem value="Easy" sx={{ color: '#0f172a' }}>Easy</MenuItem>
                <MenuItem value="Medium" sx={{ color: '#0f172a' }}>Medium</MenuItem>
                <MenuItem value="Hard" sx={{ color: '#0f172a' }}>Hard</MenuItem>
              </Select>
            </FormControl>

            {/* Status Dropdown */}
            <FormControl size="small" sx={{ minWidth: { sm: 140 }, width: '100%' }}>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                sx={{
                  color: '#0f172a',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#cbd5e1' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#0f172a' },
                  '& .MuiSelect-icon': { color: '#0f172a' },
                }}
              >
                <MenuItem value="All" sx={{ color: '#0f172a' }}>All Statuses</MenuItem>
                <MenuItem value="Solved" sx={{ color: '#0f172a' }}>Solved</MenuItem>
                <MenuItem value="Unsolved" sx={{ color: '#0f172a' }}>Unsolved</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Random Pick Button */}
          {/* <Button
            variant="outlined"
            startIcon={<ShuffleIcon />}
            onClick={() => {
              const randomId = Math.floor(Math.random() * MOCK_PROBLEMS.length) + 1;
              alert(`Redirecting to Problem #${randomId}`);
            }}
            sx={{
              borderColor: '#e2e8f0',
              color: '#0f172a',
              textTransform: 'none',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              borderRadius: '8px',
              height: '40px',
              width: { xs: '100%', md: 'auto' },
              '&:hover': {
                borderColor: '#0f172a',
                backgroundColor: '#f1f5f9',
              },
            }}
          >
            Pick Random
          </Button> */}
        </Paper>

        {/* Responsive Table Container */}
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            backgroundColor: '#ffffff',
            overflowX: 'auto',
          }}
        >
          <Table sx={{ width: '100%', minWidth: { xs: '100%', sm: 600 } }}>
            <TableHead sx={{ backgroundColor: '#f8fafc' }}>
              <TableRow>
                <TableCell width={48} sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.75rem', py: 1.5, px: { xs: 1.5, sm: 2 } }}>
                  STATUS
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.75rem', py: 1.5, px: { xs: 1.5, sm: 2 } }}>
                  TITLE
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.75rem', py: 1.5, display: { xs: 'none', md: 'table-cell' } }}>
                  CATEGORY
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.75rem', py: 1.5, px: { xs: 1, sm: 2 } }}>
                  DIFFICULTY
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.75rem', py: 1.5, display: { xs: 'none', sm: 'table-cell' } }}>
                  ACCEPTANCE
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.75rem', py: 1.5, px: { xs: 1.5, sm: 2 } }}>
                  ACTION
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedProblems.length > 0 ? (
                paginatedProblems.map((problem) => (
                  <TableRow
                    key={problem.id}
                    hover
                    sx={{
                      '&:last-child td, &:last-child th': { border: 0 },
                      transition: 'background-color 0.2s',
                    }}
                  >
                    {/* Status Icon */}
                    <TableCell sx={{ py: 2, px: { xs: 1.5, sm: 2 } }}>
                      {problem.solved ? <CheckCircleIcon /> : <UncheckedIcon />}
                    </TableCell>

                    {/* Problem Title & Responsive Metadata */}
                    <TableCell sx={{ py: 2, px: { xs: 1.5, sm: 2 } }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography
                            component={Link}
                            to={`/problems/${problem.id}`}
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              color: '#0f172a',
                              textDecoration: 'none',
                              fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                              '&:hover': { color: '#2563eb', textDecoration: 'underline' },
                            }}
                          >
                            {problem.id}. {problem.title}
                          </Typography>
                          {problem.premium && (
                            <Chip
                              label="PRO"
                              size="small"
                              sx={{
                                height: '18px',
                                fontSize: '0.625rem',
                                fontWeight: 700,
                                backgroundColor: '#fef3c7',
                                color: '#b45309',
                              }}
                            />
                          )}
                        </Box>

                        {/* Inline metadata visible ONLY on Mobile/Small screens */}
                        <Typography
                          variant="caption"
                          sx={{
                            color: '#64748b',
                            display: { xs: 'block', md: 'none' },
                            fontSize: '0.75rem',
                          }}
                        >
                          {problem.category} • {problem.acceptance}
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* Category (Hidden on mobile) */}
                    <TableCell sx={{ py: 2, color: '#64748b', fontSize: '0.875rem', display: { xs: 'none', md: 'table-cell' } }}>
                      {problem.category}
                    </TableCell>

                    {/* Difficulty Badge */}
                    <TableCell sx={{ py: 2, px: { xs: 1, sm: 2 } }}>{getDifficultyChip(problem.difficulty)}</TableCell>

                    {/* Acceptance (Hidden on mobile) */}
                    <TableCell sx={{ py: 2, color: '#64748b', fontSize: '0.875rem', display: { xs: 'none', sm: 'table-cell' } }}>
                      {problem.acceptance}
                    </TableCell>

                    {/* Action Button */}
                    <TableCell align="right" sx={{ py: 2, px: { xs: 1.5, sm: 2 } }}>
                      <Button
                        component={Link}
                        to={`/problems/${problem.id}`}
                        variant="contained"
                        size="small"
                        sx={{
                          backgroundColor: '#0f172a',
                          color: '#ffffff',
                          textTransform: 'none',
                          fontWeight: 600,
                          borderRadius: '6px',
                          minWidth: { xs: '36px', sm: '80px' },
                          px: { xs: 1, sm: 2 },
                          boxShadow: 'none',
                          '&:hover': {
                            backgroundColor: '#1e293b',
                            boxShadow: 'none',
                          },
                        }}
                      >
                        {/* Text hidden on tiny screens to save space */}
                        <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' }, mr: 0.5 }}>
                          Solve
                        </Box>
                        <ArrowForwardIcon />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 500 }}>
                      No problems found matching your filters.
                    </Typography>
                    <Button
                      size="small"
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('All');
                        setSelectedDifficulty('All');
                        setStatusFilter('All');
                      }}
                      sx={{ mt: 1, color: '#2563eb', textTransform: 'none', fontWeight: 600 }}
                    >
                      Clear Filters
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, pb: 2 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(e, value) => setPage(value)}
              shape="rounded"
              sx={{
                '& .MuiPaginationItem-root': { color: '#0f172a', fontWeight: 600 },
                '& .Mui-selected': { backgroundColor: '#e2e8f0 !important' },
              }}
            />
          </Box>
        )}
      </Container>
    </Box>
  );
}