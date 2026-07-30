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
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import CodeIcon from '@mui/icons-material/Code';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import EventIcon from '@mui/icons-material/Event';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ScheduleIcon from '@mui/icons-material/Schedule';

// Helper component for Heatmap
const Heatmap = () => {
  const months = 52;
  const daysPerWeek = 7;
  const columns = [];
  
  for (let i = 0; i < months; i++) {
    const cells = [];
    for (let j = 0; j < daysPerWeek; j++) {
      const rand = Math.random();
      let colorClass = '#f1f5f9'; // Empty (slate-100)
      if (rand > 0.9) colorClass = '#10b981'; // High intensity (emerald-500)
      else if (rand > 0.7) colorClass = '#34d399'; // Medium intensity (emerald-400)
      else if (rand > 0.4) colorClass = '#a7f3d0'; // Low intensity (emerald-200)
      
      cells.push(
        <Box 
          key={j} 
          sx={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: colorClass }} 
        />
      );
    }
    columns.push(
      <Box key={i} sx={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
        {cells}
      </Box>
    );
  }
  
  return (
    <Box sx={{ overflowX: 'auto', msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
      <Box sx={{ display: 'flex', gap: '3px', pb: 1 }}>
        {columns}
      </Box>
    </Box>
  );
};

export default function Dashboard() {
  const [user, setUser] = useState({ username: 'User' });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user data");
      }
    }
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

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc', py: { xs: 3, md: 5 }, px: { xs: 2, md: 4 } }}>
      <Container maxWidth="lg">
        {/* Welcome Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 3 }}>
          <Avatar
            sx={{
              width: 72,
              height: 72,
              backgroundColor: '#0f172a',
              color: '#ffffff',
              fontSize: '2rem',
              fontWeight: 700,
            }}
          >
            {getInitials(user.username || user.email)}
          </Avatar>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em' }}>
              Welcome back, {user.username || user.email?.split('@')[0] || 'User'}!
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b', mt: 0.5 }}>
              {currentDate} • Let's crush some code today.
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Main Progress Cards */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              {/* Overall Progress */}
              <Grid item xs={12}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                      Problems Solved
                    </Typography>
                    <Typography variant="h3" sx={{ color: '#0f172a', fontWeight: 700, mt: 1 }}>
                      42 <Typography component="span" variant="h6" sx={{ color: '#94a3b8', fontWeight: 500 }}>/ 250</Typography>
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Chip icon={<WhatshotIcon />} label="14 Day Streak" sx={{ backgroundColor: '#fff7ed', color: '#ea580c', fontWeight: 600, mb: 1 }} />
                    <Typography variant="body2" sx={{ color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                      <TrendingUpIcon fontSize="small" /> Top 5% this month
                    </Typography>
                  </Box>
                </Paper>
              </Grid>

              {/* Difficulty Breakdown */}
              <Grid item xs={12} sm={4}>
                <Paper elevation={0} sx={{ p: 2.5, backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', borderTop: '4px solid #10b981' }}>
                  <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 600 }}>Easy</Typography>
                  <Typography variant="h4" sx={{ color: '#0f172a', fontWeight: 700, my: 1 }}>215</Typography>
                  <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 500 }}>/ 750</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper elevation={0} sx={{ p: 2.5, backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', borderTop: '4px solid #f59e0b' }}>
                  <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 600 }}>Medium</Typography>
                  <Typography variant="h4" sx={{ color: '#0f172a', fontWeight: 700, my: 1 }}>185</Typography>
                  <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 500 }}>/ 1500</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper elevation={0} sx={{ p: 2.5, backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', borderTop: '4px solid #ef4444' }}>
                  <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 600 }}>Hard</Typography>
                  <Typography variant="h4" sx={{ color: '#0f172a', fontWeight: 700, my: 1 }}>32</Typography>
                  <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 500 }}>/ 550</Typography>
                </Paper>
              </Grid>

              {/* Heatmap Section */}
              <Grid item xs={12}>
                <Paper elevation={0} sx={{ p: 2.5, backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '1.125rem' }}>
                      742 Submissions in the last year
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography variant="caption" sx={{ color: '#64748b', mr: 0.5 }}>Less</Typography>
                      <Box sx={{ width: 10, height: 10, borderRadius: '2px', backgroundColor: '#f1f5f9' }} />
                      <Box sx={{ width: 10, height: 10, borderRadius: '2px', backgroundColor: '#a7f3d0' }} />
                      <Box sx={{ width: 10, height: 10, borderRadius: '2px', backgroundColor: '#34d399' }} />
                      <Box sx={{ width: 10, height: 10, borderRadius: '2px', backgroundColor: '#10b981' }} />
                      <Typography variant="caption" sx={{ color: '#64748b', ml: 0.5 }}>More</Typography>
                    </Box>
                  </Box>
                  <Heatmap />
                </Paper>
              </Grid>

              {/* Recent Activity */}
              <Grid item xs={12}>
                <Paper elevation={0} sx={{ p: 0, backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                  <Box sx={{ p: 2.5, borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '1.125rem' }}>
                      Recent Submissions
                    </Typography>
                    <Button component={Link} to="/problems" size="small" sx={{ textTransform: 'none', fontWeight: 600, color: '#2563eb' }}>
                      View all
                    </Button>
                  </Box>
                  <List disablePadding>
                    {[
                      { title: 'Median of Two Sorted Arrays', lang: 'Rust', time: '2 hours ago', status: 'Accepted' },
                      { title: 'LRU Cache', lang: 'C++', time: '5 hours ago', status: 'Rejected' },
                      { title: 'Trapping Rain Water', lang: 'Python', time: 'Yesterday', status: 'Accepted' },
                      { title: 'Regular Expression Matching', lang: 'Go', time: 'Yesterday', status: 'Pending' },
                    ].map((activity, index) => (
                      <React.Fragment key={index}>
                        <ListItem sx={{ py: 2, px: 2.5 }}>
                          <ListItemIcon sx={{ minWidth: 40 }}>
                            {activity.status === 'Accepted' ? (
                              <CheckCircleIcon sx={{ color: '#10b981' }} />
                            ) : activity.status === 'Rejected' ? (
                              <CodeIcon sx={{ color: '#ef4444' }} />
                            ) : (
                              <ScheduleIcon sx={{ color: '#f59e0b' }} />
                            )}
                          </ListItemIcon>
                          <ListItemText 
                            primary={activity.title}
                            secondary={`${activity.time} • ${activity.status}`}
                            primaryTypographyProps={{ fontWeight: 600, color: '#0f172a' }}
                            secondaryTypographyProps={{ color: '#64748b', mt: 0.5, fontSize: '0.8rem' }}
                          />
                          <Chip 
                            label={activity.lang} 
                            size="small" 
                            sx={{ 
                              backgroundColor: '#f1f5f9', 
                              color: '#475569',
                              fontWeight: 600,
                              fontSize: '0.7rem',
                              fontFamily: 'monospace'
                            }} 
                          />
                        </ListItem>
                        {index < 3 && <Divider />}
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
                    p: 3, 
                    backgroundColor: '#0f172a', 
                    color: '#ffffff', 
                    borderRadius: '12px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Chip 
                      label="Daily Challenge" 
                      size="small" 
                      sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#ffffff', fontWeight: 600, mb: 2 }} 
                    />
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                      Trapping Rain Water
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#94a3b8', mb: 3 }}>
                      Hard • Array • Two Pointers
                    </Typography>
                    <Button 
                      component={Link}
                      to="/problems"
                      variant="contained" 
                      startIcon={<PlayCircleFilledWhiteIcon />}
                      sx={{ 
                        backgroundColor: '#ffffff', 
                        color: '#0f172a',
                        fontWeight: 600,
                        textTransform: 'none',
                        '&:hover': { backgroundColor: '#f1f5f9' }
                      }}
                    >
                      Solve Challenge
                    </Button>
                  </Box>
                  <Box 
                    sx={{ 
                      position: 'absolute', 
                      top: -20, 
                      right: -20, 
                      width: 120, 
                      height: 120, 
                      borderRadius: '50%', 
                      background: 'linear-gradient(135deg, rgba(56,189,248,0.3) 0%, rgba(37,99,235,0) 100%)',
                      zIndex: 0
                    }} 
                  />
                </Paper>
              </Grid>

              {/* Upcoming Contests */}
              <Grid item xs={12}>
                <Paper elevation={0} sx={{ p: 2.5, backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <EventIcon sx={{ color: '#10b981' }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '1.125rem' }}>
                      Upcoming Contests
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#0f172a' }}>Weekly Contest 384</Typography>
                        <Typography variant="caption" sx={{ color: '#64748b' }}>Starts in 1h 24m • 90 mins</Typography>
                      </Box>
                      <Chip label="Live" size="small" sx={{ backgroundColor: '#d1fae5', color: '#065f46', fontWeight: 700, fontSize: '0.65rem', height: '20px' }} />
                    </Box>
                    <Divider />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#0f172a' }}>Biweekly Contest 125</Typography>
                      <Typography variant="caption" sx={{ color: '#64748b' }}>Mar 12, 18:00 • 2 hours</Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>

              {/* Bookmarked Problems */}
              <Grid item xs={12}>
                <Paper elevation={0} sx={{ p: 2.5, backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <BookmarkIcon sx={{ color: '#2563eb' }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '1.125rem' }}>
                      Bookmarks
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {[
                      { title: 'Sudoku Solver', diff: 'Hard' },
                      { title: 'Binary Tree Zigzag', diff: 'Medium' },
                      { title: 'Two Sum II', diff: 'Easy' },
                    ].map((item, idx) => (
                      <Box key={idx} sx={{ p: 1.5, borderRadius: '8px', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center', '&:hover': { backgroundColor: '#f1f5f9' } }}>
                        <Typography variant="body2" sx={{ fontWeight: 500, color: '#0f172a' }}>{item.title}</Typography>
                        <Chip 
                          label={item.diff} 
                          size="small" 
                          sx={{ 
                            backgroundColor: item.diff === 'Easy' ? '#d1fae5' : item.diff === 'Medium' ? '#fef3c7' : '#ffe4e6', 
                            color: item.diff === 'Easy' ? '#065f46' : item.diff === 'Medium' ? '#92400e' : '#9f1239',
                            fontWeight: 600,
                            fontSize: '0.65rem',
                            height: '20px'
                          }} 
                        />
                      </Box>
                    ))}
                  </Box>
                  <Button fullWidth size="small" sx={{ mt: 2, textTransform: 'none', color: '#64748b' }}>
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