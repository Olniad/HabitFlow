import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [habits, setHabits] = useState([
    { id: 1, name: 'Beber água', count: 0 },
    { id: 2, name: 'Exercícios', count: 0 },
    { id: 3, name: 'Estudar', count: 0 }
  ]);
  
  const [newHabit, setNewHabit] = useState('');

  // Efeito para reset diário (simulação)
  useEffect(() => {
    const timer = setInterval(() => {
      // Aqui iria a lógica para resetar à meia-noite
    }, 86400000); // 24h em ms
    
    return () => clearInterval(timer);
  }, []);

  const increment = (id) => {
    setHabits(habits.map(habit => 
      habit.id === id ? {...habit, count: habit.count + 1} : habit
    ));
  };

  const addHabit = () => {
    if (newHabit.trim()) {
      setHabits([...habits, {
        id: Date.now(),
        name: newHabit,
        count: 0
      }]);
      setNewHabit('');
    }
  };

  return (
    <div className="app">
      <h1>Meus Hábitos Diários</h1>
      
      <div className="add-habit">
        <input
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          placeholder="Novo hábito"
        />
        <button onClick={addHabit}>+</button>
      </div>
      
      <div className="habits-list">
        {habits.map(habit => (
          <div key={habit.id} className="habit-card">
            <span>{habit.name}</span>
            <div className="counter">
              <button onClick={() => increment(habit.id)}>+</button>
              <span>{habit.count}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;