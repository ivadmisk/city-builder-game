import React from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';

const GameDashboard: React.FC = () => {
  const cityStats = {
    population: 1000,
    money: 10000,
    happiness: 85,
    resources: {
      wood: 100,
      stone: 50,
      food: 200
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Статистика города */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Статистика города
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="Население" secondary={cityStats.population} />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText primary="Деньги" secondary={`${cityStats.money} 💰`} />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText primary="Счастье" secondary={`${cityStats.happiness}% 😊`} />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Ресурсы */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Ресурсы
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="Дерево" secondary={`${cityStats.resources.wood} 🌳`} />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText primary="Камень" secondary={`${cityStats.resources.stone} 🪨`} />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText primary="Еда" secondary={`${cityStats.resources.food} 🍎`} />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Действия */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Действия
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button variant="contained" color="primary">
                Построить здание
              </Button>
              <Button variant="contained" color="secondary">
                Собрать ресурсы
              </Button>
              <Button variant="outlined">
                Исследовать территорию
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default GameDashboard; 