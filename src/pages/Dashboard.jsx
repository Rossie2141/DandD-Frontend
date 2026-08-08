import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import {
  Box,
  Typography,
  Container,
  Paper,
  Grid,
  Button,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Tooltip,
  CircularProgress,
  LinearProgress,
  alpha
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import CodeIcon from '@mui/icons-material/Code';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import EventIcon from '@mui/icons-material/Event';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ScheduleIcon from '@mui/icons-material/Schedule';
import SchoolIcon from '@mui/icons-material/School';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

// Helper component for Heatmap
const Heatmap = ({ heatmapData }) => {
  const months = 52;
  const daysPerWeek = 7;
  const columns = [];
  
  const today = new Date();
  
  for (let i = 0; i < months; i++) {
    const cells = [];
    for (let j = 0; j < daysPerWeek; j++) {
      const daysAgo = (months - 1 - i) * 7 + (daysPerWeek - 1 - j);
      const cellDate = new Date(today);
      cellDate.setDate(today.getDate() - daysAgo);
      const dateStr = cellDate.toISOString().split('T')[0];
      
      const count = heatmapData[dateStr] || 0;
      
      let colorClass = '#f1f5f9'; // Empty
      if (count > 4) colorClass = '#10b981'; // High intensity
      else if (count > 2) colorClass = '#34d399'; // Medium intensity
      else if (count > 0) colorClass = '#a7f3d0'; // Low intensity
      
      cells.push(
        <Tooltip key={j} title={`${dateStr}: ${count} submissions`} arrow placement="top">
          <Box 
            sx={{ 
              width: '12px', 
              height: '12px', 
              borderRadius: '3px', 
              backgroundColor: colorClass,
              transition: 'all 0.2s ease-in-out',
              cursor: 'pointer',
              '&:hover': {
                transform: 'scale(1.2)',
                boxShadow: '0 0 8px rgba(16, 185, 129, 0.4)',
                zIndex: 10
              }
            }} 
          />
        </Tooltip>
      );
    }
    columns.push(
      <Box key={i} sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {cells}
      </Box>
    );
  }
  
  return (
    <Box sx={{ overflowX: 'auto', msOverflowStyle: 'none', scrollbarWidth: 'none', py: 1 }}>
      <Box sx={{ display: 'flex', gap: '4px', pb: 1 }}>
        {columns}
      </Box>
    </Box>
  );
};

export default function Dashboard() {
  const [user, setUser] = useState({ username: 'User' });
  const [stats, setStats] = useState({
    total_solved: 0,
    total_problems: 0,
    difficulty_breakdown: {
      easy_solved: 0, easy_total: 0,
      medium_solved: 0, medium_total: 0,
      hard_solved: 0, hard_total: 0
    },
    topics_covered: [],
    recent_submissions: [],
    heatmap_data: {}
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user data");
      }
    }

    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) return;
        
        const response = await fetch('http://localhost:8000/api/v1/dashboard/stats', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      }
    };

    fetchStats();
  }, []);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const totalHeatmapSubs = Object.values(stats.heatmap_data).reduce((a, b) => a + b, 0);

  // Reusable hover style for cards
  const cardHoverStyle = {
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 12px 24px -10px rgba(0, 0, 0, 0.1)',
    }
  };

  const diffBreakdown = stats.difficulty_breakdown;
  
  const calculateProgress = (solved, total) => {
    if (!total || total === 0) return 0;
    return (solved / total) * 100;
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f4f7f9', py: { xs: 3, md: 5 }, px: { xs: 2, md: 4 } }}>
      <Container maxWidth="lg">
        {/* Welcome Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 5, gap: 3 }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
              color: '#ffffff',
              fontSize: '2.5rem',
              fontWeight: 800,
              boxShadow: '0 8px 16px rgba(99, 102, 241, 0.3)'
            }}
          >
            {getInitials(user.username || user.email)}
          </Avatar>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em' }}>
              Welcome back, <Box component="span" sx={{ background: '-webkit-linear-gradient(45deg, #4f46e5, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{user.username || user.email?.split('@')[0] || 'User'}</Box>!
            </Typography>
            <Typography variant="h6" sx={{ color: '#64748b', mt: 0.5, fontWeight: 500 }}>
              {currentDate} • Ready to master some algorithms?
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={4}>
          {/* Main Progress Cards */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={3}>
              {/* Overall Progress */}
              <Grid item xs={12}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    backgroundColor: '#ffffff',
                    borderRadius: '20px',
                    border: '1px solid rgba(226, 232, 240, 0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    position: 'relative',
                    overflow: 'hidden',
                    ...cardHoverStyle
                  }}
                >
                  <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Typography variant="subtitle1" sx={{ color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>
                      Total Problems Solved
                    </Typography>
                    <Typography variant="h2" sx={{ color: '#0f172a', fontWeight: 800, mt: 1, letterSpacing: '-0.02em' }}>
                      {stats.total_solved} <Typography component="span" variant="h5" sx={{ color: '#94a3b8', fontWeight: 600 }}>/ {stats.total_problems || '-'}</Typography>
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right', position: 'relative', zIndex: 1 }}>
                    <Chip icon={<WhatshotIcon sx={{ color: '#ea580c !important' }}/>} label="14 Day Streak" sx={{ backgroundColor: '#fff7ed', color: '#ea580c', fontWeight: 700, mb: 1.5, fontSize: '0.85rem', py: 2 }} />
                    <Typography variant="subtitle2" sx={{ color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                      <TrendingUpIcon fontSize="small" /> Top 5% this week
                    </Typography>
                  </Box>
                  {/* Decorative background blob */}
                  <Box sx={{ position: 'absolute', right: '-10%', top: '-50%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(99,102,241,0.05) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%', zIndex: 0 }} />
                </Paper>
              </Grid>

              {/* Difficulty Breakdown */}
              <Grid item xs={12} sm={4}>
                <Paper elevation={0} sx={{ p: 3, backgroundColor: '#ffffff', borderRadius: '20px', border: '1px solid rgba(226, 232, 240, 0.8)', position: 'relative', overflow: 'hidden', ...cardHoverStyle }}>
                  <Typography variant="subtitle1" sx={{ color: '#10b981', fontWeight: 700, mb: 2 }}>Easy</Typography>
                  <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
                    <CircularProgress variant="determinate" value={100} sx={{ color: '#f1f5f9' }} size={60} thickness={4} />
                    <CircularProgress variant="determinate" value={calculateProgress(diffBreakdown.easy_solved, diffBreakdown.easy_total)} sx={{ color: '#10b981', position: 'absolute', left: 0 }} size={60} thickness={4} />
                    <Box sx={{ top: 0, left: 0, bottom: 0, right: 0, position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography variant="caption" component="div" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.9rem' }}>
                        {diffBreakdown.easy_solved}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>out of {diffBreakdown.easy_total}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper elevation={0} sx={{ p: 3, backgroundColor: '#ffffff', borderRadius: '20px', border: '1px solid rgba(226, 232, 240, 0.8)', position: 'relative', overflow: 'hidden', ...cardHoverStyle }}>
                  <Typography variant="subtitle1" sx={{ color: '#f59e0b', fontWeight: 700, mb: 2 }}>Medium</Typography>
                  <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
                    <CircularProgress variant="determinate" value={100} sx={{ color: '#f1f5f9' }} size={60} thickness={4} />
                    <CircularProgress variant="determinate" value={calculateProgress(diffBreakdown.medium_solved, diffBreakdown.medium_total)} sx={{ color: '#f59e0b', position: 'absolute', left: 0 }} size={60} thickness={4} />
                    <Box sx={{ top: 0, left: 0, bottom: 0, right: 0, position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography variant="caption" component="div" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.9rem' }}>
                        {diffBreakdown.medium_solved}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>out of {diffBreakdown.medium_total}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper elevation={0} sx={{ p: 3, backgroundColor: '#ffffff', borderRadius: '20px', border: '1px solid rgba(226, 232, 240, 0.8)', position: 'relative', overflow: 'hidden', ...cardHoverStyle }}>
                  <Typography variant="subtitle1" sx={{ color: '#ef4444', fontWeight: 700, mb: 2 }}>Hard</Typography>
                  <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
                    <CircularProgress variant="determinate" value={100} sx={{ color: '#f1f5f9' }} size={60} thickness={4} />
                    <CircularProgress variant="determinate" value={calculateProgress(diffBreakdown.hard_solved, diffBreakdown.hard_total)} sx={{ color: '#ef4444', position: 'absolute', left: 0 }} size={60} thickness={4} />
                    <Box sx={{ top: 0, left: 0, bottom: 0, right: 0, position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography variant="caption" component="div" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.9rem' }}>
                        {diffBreakdown.hard_solved}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>out of {diffBreakdown.hard_total}</Typography>
                </Paper>
              </Grid>

              {/* Topics Covered */}
              {stats.topics_covered && stats.topics_covered.length > 0 && (
                <Grid item xs={12}>
                  <Paper elevation={0} sx={{ p: 3.5, backgroundColor: '#ffffff', borderRadius: '20px', border: '1px solid rgba(226, 232, 240, 0.8)', ...cardHoverStyle }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                      <Box sx={{ p: 1, borderRadius: '10px', backgroundColor: '#ede9fe', display: 'flex' }}>
                        <SchoolIcon sx={{ color: '#8b5cf6' }} />
                      </Box>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.01em' }}>
                        Skills & Topics
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                      {stats.topics_covered.map((topic, index) => (
                        <Chip 
                          key={index} 
                          label={topic} 
                          sx={{ 
                            backgroundColor: '#f8fafc', 
                            color: '#334155',
                            fontWeight: 600,
                            borderRadius: '10px',
                            border: '1px solid #e2e8f0',
                            px: 1,
                            py: 2.5,
                            fontSize: '0.85rem',
                            transition: 'all 0.2s',
                            '&:hover': { backgroundColor: '#f1f5f9', transform: 'translateY(-2px)' }
                          }} 
                        />
                      ))}
                    </Box>
                  </Paper>
                </Grid>
              )}

              {/* Heatmap Section */}
              <Grid item xs={12}>
                <Paper elevation={0} sx={{ p: 4, backgroundColor: '#ffffff', borderRadius: '20px', border: '1px solid rgba(226, 232, 240, 0.8)', ...cardHoverStyle }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.01em' }}>
                      {totalHeatmapSubs} Submissions in the last year
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>Less</Typography>
                      <Box sx={{ width: 12, height: 12, borderRadius: '3px', backgroundColor: '#f1f5f9' }} />
                      <Box sx={{ width: 12, height: 12, borderRadius: '3px', backgroundColor: '#a7f3d0' }} />
                      <Box sx={{ width: 12, height: 12, borderRadius: '3px', backgroundColor: '#34d399' }} />
                      <Box sx={{ width: 12, height: 12, borderRadius: '3px', backgroundColor: '#10b981' }} />
                      <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>More</Typography>
                    </Box>
                  </Box>
                  <Heatmap heatmapData={stats.heatmap_data} />
                </Paper>
              </Grid>

              {/* Recent Activity */}
              <Grid item xs={12}>
                <Paper elevation={0} sx={{ p: 0, backgroundColor: '#ffffff', borderRadius: '20px', border: '1px solid rgba(226, 232, 240, 0.8)', overflow: 'hidden', ...cardHoverStyle }}>
                  <Box sx={{ p: 3.5, borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.01em' }}>
                      Recent Activity
                    </Typography>
                    <Button component={Link} to="/problems" size="small" sx={{ textTransform: 'none', fontWeight: 700, color: '#4f46e5', backgroundColor: '#eef2ff', borderRadius: '8px', px: 2, '&:hover': { backgroundColor: '#e0e7ff' } }}>
                      View all
                    </Button>
                  </Box>
                  <List disablePadding>
                    {!stats.recent_submissions || stats.recent_submissions.length === 0 ? (
                      <ListItem sx={{ py: 5, justifyContent: 'center' }}>
                        <Typography variant="body1" sx={{ color: '#94a3b8', fontWeight: 500 }}>No recent submissions found.</Typography>
                      </ListItem>
                    ) : stats.recent_submissions.map((activity, index) => (
                      <React.Fragment key={index}>
                        <ListItem sx={{ py: 2.5, px: 3.5, transition: 'background-color 0.2s', '&:hover': { backgroundColor: '#f8fafc' } }}>
                          <ListItemIcon sx={{ minWidth: 48 }}>
                            {activity.status === 'Accepted' ? (
                              <Box sx={{ backgroundColor: '#d1fae5', p: 1, borderRadius: '50%', display: 'flex' }}>
                                <CheckCircleIcon sx={{ color: '#10b981', fontSize: '1.25rem' }} />
                              </Box>
                            ) : activity.status === 'Wrong Answer' || activity.status.includes('Error') ? (
                              <Box sx={{ backgroundColor: '#fee2e2', p: 1, borderRadius: '50%', display: 'flex' }}>
                                <CodeIcon sx={{ color: '#ef4444', fontSize: '1.25rem' }} />
                              </Box>
                            ) : (
                              <Box sx={{ backgroundColor: '#fef3c7', p: 1, borderRadius: '50%', display: 'flex' }}>
                                <ScheduleIcon sx={{ color: '#f59e0b', fontSize: '1.25rem' }} />
                              </Box>
                            )}
                          </ListItemIcon>
                          <ListItemText 
                            primary={activity.title}
                            secondary={`${activity.time} • ${activity.status}`}
                            primaryTypographyProps={{ fontWeight: 700, color: '#0f172a', fontSize: '1rem' }}
                            secondaryTypographyProps={{ color: '#64748b', mt: 0.5, fontSize: '0.85rem', fontWeight: 500 }}
                          />
                          <Chip 
                            label={activity.language} 
                            size="small" 
                            sx={{ 
                              backgroundColor: '#f1f5f9', 
                              color: '#475569',
                              fontWeight: 700,
                              fontSize: '0.75rem',
                              fontFamily: '"Fira Code", monospace',
                              borderRadius: '6px'
                            }} 
                          />
                        </ListItem>
                        {index < stats.recent_submissions.length - 1 && <Divider sx={{ borderColor: '#f1f5f9' }} />}
                      </React.Fragment>
                    ))}
                  </List>
                </Paper>
              </Grid>
            </Grid>
          </Grid>

          {/* Right Sidebar */}
          <Grid item xs={12} md={4}>
            <Grid container spacing={3}>
              {/* Daily Challenge */}
              <Grid item xs={12}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 4, 
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', 
                    color: '#ffffff', 
                    borderRadius: '20px',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px) scale(1.01)',
                    }
                  }}
                >
                  <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                      <Chip 
                        icon={<EmojiEventsIcon sx={{ color: '#fbbf24 !important' }}/>}
                        label="Daily Challenge" 
                        size="small" 
                        sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#ffffff', fontWeight: 700, py: 1.5, backdropFilter: 'blur(10px)' }} 
                      />
                      <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>Time left: 08:24:12</Typography>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                      Trapping Rain Water
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 4 }}>
                      <Chip label="Hard" size="small" sx={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', fontWeight: 700, fontSize: '0.7rem' }} />
                      <Chip label="Array" size="small" sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#cbd5e1', fontWeight: 600, fontSize: '0.7rem' }} />
                    </Box>
                    <Button 
                      component={Link}
                      to="/problems"
                      variant="contained" 
                      startIcon={<PlayCircleFilledWhiteIcon />}
                      fullWidth
                      sx={{ 
                        backgroundColor: '#ffffff', 
                        color: '#0f172a',
                        fontWeight: 800,
                        textTransform: 'none',
                        py: 1.5,
                        borderRadius: '12px',
                        fontSize: '1rem',
                        '&:hover': { backgroundColor: '#f8fafc', transform: 'scale(1.02)' },
                        transition: 'all 0.2s'
                      }}
                    >
                      Solve Challenge
                    </Button>
                  </Box>
                  {/* Decorative glassmorphism blobs */}
                  <Box sx={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, background: 'linear-gradient(135deg, #38bdf8 0%, #3b82f6 100%)', borderRadius: '50%', opacity: 0.5, filter: 'blur(40px)', zIndex: 0 }} />
                  <Box sx={{ position: 'absolute', bottom: -50, left: -20, width: 150, height: 150, background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)', borderRadius: '50%', opacity: 0.4, filter: 'blur(30px)', zIndex: 0 }} />
                </Paper>
              </Grid>

              {/* Upcoming Contests */}
              <Grid item xs={12}>
                <Paper elevation={0} sx={{ p: 3.5, backgroundColor: '#ffffff', borderRadius: '20px', border: '1px solid rgba(226, 232, 240, 0.8)', ...cardHoverStyle }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                    <Box sx={{ p: 1, borderRadius: '10px', backgroundColor: '#d1fae5', display: 'flex' }}>
                      <EventIcon sx={{ color: '#10b981' }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
                      Upcoming Contests
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', p: 2, backgroundColor: '#f8fafc', borderRadius: '12px', borderLeft: '4px solid #10b981' }}>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a' }}>Weekly Contest 384</Typography>
                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>Starts in 1h 24m • 90 mins</Typography>
                      </Box>
                      <Chip label="Live" size="small" sx={{ backgroundColor: '#10b981', color: '#ffffff', fontWeight: 800, fontSize: '0.7rem' }} />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', p: 2, backgroundColor: '#f8fafc', borderRadius: '12px', borderLeft: '4px solid #3b82f6' }}>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a' }}>Biweekly Contest 125</Typography>
                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>Mar 12, 18:00 • 2 hours</Typography>
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              </Grid>

              {/* Bookmarked Problems */}
              <Grid item xs={12}>
                <Paper elevation={0} sx={{ p: 3.5, backgroundColor: '#ffffff', borderRadius: '20px', border: '1px solid rgba(226, 232, 240, 0.8)', ...cardHoverStyle }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                    <Box sx={{ p: 1, borderRadius: '10px', backgroundColor: '#dbeafe', display: 'flex' }}>
                      <BookmarkIcon sx={{ color: '#3b82f6' }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
                      Bookmarks
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {[
                      { title: 'Sudoku Solver', diff: 'Hard' },
                      { title: 'Binary Tree Zigzag', diff: 'Medium' },
                      { title: 'Two Sum II', diff: 'Easy' },
                    ].map((item, idx) => (
                      <Box key={idx} sx={{ p: 2, borderRadius: '12px', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s', '&:hover': { backgroundColor: '#f1f5f9', transform: 'translateX(4px)' } }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>{item.title}</Typography>
                        <Chip 
                          label={item.diff} 
                          size="small" 
                          sx={{ 
                            backgroundColor: item.diff === 'Easy' ? '#d1fae5' : item.diff === 'Medium' ? '#fef3c7' : '#fee2e2', 
                            color: item.diff === 'Easy' ? '#047857' : item.diff === 'Medium' ? '#b45309' : '#b91c1c',
                            fontWeight: 700,
                            fontSize: '0.7rem'
                          }} 
                        />
                      </Box>
                    ))}
                  </Box>
                  <Button fullWidth size="small" sx={{ mt: 2, textTransform: 'none', color: '#64748b', fontWeight: 600, '&:hover': { backgroundColor: '#f8fafc' } }}>
                    View all 12 items
                  </Button>
                </Paper>
              </Grid>

            </Grid>
          </Grid>
        </Grid>

      </Container>
    </Box>
  );
}