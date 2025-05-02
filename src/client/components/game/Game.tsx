import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';

interface City {
  _id: string;
  name: string;
  population: number;
  resources: {
    gold: number;
    wood: number;
    stone: number;
    food: number;
  };
  buildings: Array<{
    _id: string;
    type: string;
    level: number;
    position: {
      x: number;
      y: number;
      z: number;
    };
  }>;
}

export const Game: React.FC = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openNewCityDialog, setOpenNewCityDialog] = useState(false);
  const [newCityName, setNewCityName] = useState('');

  const fetchCities = async () => {
    try {
      const response = await fetch('/api/cities', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Ошибка при получении городов');
      }

      const data = await response.json();
      setCities(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCity = async () => {
    try {
      const response = await fetch('/api/cities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ name: newCityName })
      });

      if (!response.ok) {
        throw new Error('Ошибка при создании города');
      }

      const newCity = await response.json();
      setCities([...cities, newCity]);
      setOpenNewCityDialog(false);
      setNewCityName('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4">Ваши города</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenNewCityDialog(true)}
        >
          Основать новый город
        </Button>
      </Box>

      {error && (
        <Paper sx={{ p: 2, mb: 2, bgcolor: 'error.main', color: 'error.contrastText' }}>
          {error}
        </Paper>
      )}

      <Grid container spacing={3}>
        {cities.map((city) => (
          <Grid component="div" item xs={12} md={6} lg={4} key={city._id}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                {city.name}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Население: {city.population}
              </Typography>

              <Typography variant="subtitle2" gutterBottom>
                Ресурсы:
              </Typography>
              <Grid container spacing={1}>
                <Grid component="div" item xs={6}>
                  <Typography variant="body2">Золото: {city.resources.gold}</Typography>
                </Grid>
                <Grid component="div" item xs={6}>
                  <Typography variant="body2">Дерево: {city.resources.wood}</Typography>
                </Grid>
                <Grid component="div" item xs={6}>
                  <Typography variant="body2">Камень: {city.resources.stone}</Typography>
                </Grid>
                <Grid component="div" item xs={6}>
                  <Typography variant="body2">Еда: {city.resources.food}</Typography>
                </Grid>
              </Grid>

              <Typography variant="subtitle2" sx={{ mt: 2 }} gutterBottom>
                Здания: {city.buildings.length}
              </Typography>
              
              <Button
                variant="outlined"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => {/* TODO: Добавить переход к управлению городом */}}
              >
                Управлять городом
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openNewCityDialog} onClose={() => setOpenNewCityDialog(false)}>
        <DialogTitle>Основать новый город</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Название города"
            fullWidth
            value={newCityName}
            onChange={(e) => setNewCityName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNewCityDialog(false)}>Отмена</Button>
          <Button onClick={handleCreateCity} disabled={!newCityName.trim()}>
            Основать
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}; 