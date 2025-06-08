import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';
import './App.css';

const CATEGORIES = [
  { label: 'Saúde', icon: '💧' },
  { label: 'Produtividade', icon: '📈' },
  { label: 'Leitura', icon: '📚' },
  { label: 'Bem-estar', icon: '🧘' }
];

function App() {
  const [screen, setScreen] = useState('login'); // 'login' | 'signup' | 'main'

  // Telas de login/cadastro
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Telas de hábito
  const [habits, setHabits] = useState([
    { id: 1, name: 'Beber 1 Litro de água', count: 0, target: 4, category: 'Saúde' },
    { id: 2, name: 'Ir Para a Academia', count: 0, target: 1, category: 'Saúde' },
    { id: 3, name: 'Estudar 30 minutos', count: 0, target: 4, category: 'Produtividade' }
  ]);

    const [history, setHistory] = useState(() => {
    const today = new Date();
    const generateDate = (offset) => {
      const d = new Date(today);
      d.setDate(d.getDate() - offset);
      return d.toISOString().slice(0, 10);
    };

    const fakeHistory = [];
    for (let i = 0; i < 30; i++) {
      const date = generateDate(i);
      const dayHabits = habits.map(habit => ({
        id: habit.id,
        count: Math.floor(Math.random() * (habit.target + 1)) // entre 0 e o alvo
      }));
      fakeHistory.push({ date, habits: dayHabits });
    }

    return fakeHistory.reverse(); // do mais antigo ao mais recente
  });

  const [newHabit, setNewHabit] = useState('');
  const [newCategory, setNewCategory] = useState(CATEGORIES[0].label);
  const [newTarget, setNewTarget] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [dropdownOpenId, setDropdownOpenId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [habitToDelete, setHabitToDelete] = useState(null);
  const [editHabit, setEditHabit] = useState(null);
  const [filterCategory, setFilterCategory] = useState('Todas');

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownOpenId === null) return;

      const dropdownButton = document.querySelector(
        `[data-dropdown-button-id="${dropdownOpenId}"]`
      );

      if (dropdownButton && dropdownButton.contains(event.target)) return;

      const dropdownMenu = document.querySelector(
        `[data-dropdown-menu-id="${dropdownOpenId}"]`
      );

      if (dropdownMenu && dropdownMenu.contains(event.target)) return;

      setDropdownOpenId(null);
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpenId]);

  const increment = (id) => {
    setHabits(habits.map(habit =>
      habit.id === id ? { ...habit, count: habit.count + 1 } : habit
    ));
  };

  const decrement = (id) => {
    setHabits(habits.map(habit =>
      habit.id === id && habit.count > 0
        ? { ...habit, count: habit.count - 1 }
        : habit
    ));
  };

  const addHabit = () => {
    if (newHabit.trim() && newTarget > 0) {
      setHabits([...habits, {
        id: Date.now(),
        name: newHabit,
        category: newCategory,
        target: newTarget,
        count: 0
      }]);
      setNewHabit('');
      setNewTarget(1);
      setNewCategory(CATEGORIES[0].label);
      setShowModal(false);
    }
  };

  const startEditHabit = (habit) => {
    setEditHabit(habit);
    setNewHabit(habit.name);
    setNewCategory(habit.category);
    setNewTarget(habit.target);
    setShowModal(true);
    setDropdownOpenId(null);
  };

  const saveEditHabit = () => {
    if (newHabit.trim() && newTarget > 0) {
      setHabits(habits.map(habit =>
        habit.id === editHabit.id
          ? { ...habit, name: newHabit, category: newCategory, target: newTarget }
          : habit
      ));
      setEditHabit(null);
      setNewHabit('');
      setNewTarget(1);
      setNewCategory(CATEGORIES[0].label);
      setShowModal(false);
    }
  };

  const confirmDeleteHabit = (habit) => {
    setHabitToDelete(habit);
    setShowDeleteModal(true);
    setDropdownOpenId(null);
  };

  const deleteHabit = () => {
    setHabits(habits.filter(habit => habit.id !== habitToDelete.id));
    setHabitToDelete(null);
    setShowDeleteModal(false);
  };

  const getIcon = (category) => {
    const found = CATEGORIES.find(cat => cat.label === category);
    return found ? found.icon : '🔖';
  };

  const last4DaysData = history.slice(-4).map(entry => {
    const data = { date: entry.date };
    entry.habits.forEach(h => {
      const habitName = habits.find(x => x.id === h.id)?.name || `ID ${h.id}`;
      data[habitName] = h.count;
    });
    return data;
  });

const monthlyData = habits.map(habit => {
    let total = 0;
    history.forEach(day => {
      const record = day.habits.find(x => x.id === habit.id);
      total += record ? record.count : 0;
    });
    return {
      name: habit.name,
      total
    };
  });

  const filteredHabits = filterCategory === 'Todas'
    ? habits
    : habits.filter(habit => habit.category === filterCategory);

  // === TELA DE LOGIN ===
  if (screen === 'login') {
    return (
      <div className="auth-container">
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={() => setScreen('main')}>Entrar</button>
        <p style={{ marginTop: '10px' }}>
          Não tem conta? <span className="link" onClick={() => setScreen('signup')}>Criar conta</span>
        </p>
      </div>
    );
  }

  // === TELA DE CADASTRO ===
  if (screen === 'signup') {
    return (
      <div className="auth-container">
        <h2>Criar Conta</h2>
        <input
          type="text"
          placeholder="Novo usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Nova senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={() => setScreen('main')}>Cadastrar</button>
        <p style={{ marginTop: '10px' }}>
          Já tem conta? <span className="link" onClick={() => setScreen('login')}>Voltar para login</span>
        </p>
      </div>
    );
  }

  // === TELA PRINCIPAL ===
  return (
    <div className="app">
      <h1>Meus Hábitos Diários</h1>

      <button className='btn-modal' onClick={() => {
        setShowModal(true);
        setEditHabit(null);
        setNewHabit('');
        setNewCategory(CATEGORIES[0].label);
      }}>+ Novo Hábito</button>

      <div className="category-filter" style={{ marginBottom: '20px', display: 'flex', gap: '15px', justifyContent: 'center' }}>
        <button
          className={`btn category-btn ${filterCategory === 'Todas' ? 'selected' : ''}`}
          onClick={() => setFilterCategory('Todas')}
        >
          Todas
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat.label}
            className={`btn category-btn ${filterCategory === cat.label ? 'selected' : ''}`}
            onClick={() => setFilterCategory(cat.label)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="habits-list">
        {filteredHabits.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#777', marginTop: '20px' }}>
            Nenhum hábito para a categoria selecionada.
          </p>
        ) : (
          filteredHabits.map(habit => (
            <div key={habit.id} className="habit-card">
              <span>{getIcon(habit.category)} {habit.name}</span>
              <div className="counter">
                <button className="btn decrement" onClick={() => decrement(habit.id)}>-</button>
                <span>{habit.count} / {habit.target}</span>
                <button className="btn increment" onClick={() => increment(habit.id)}>+</button>
              </div>
              <div className="dropdown-wrapper">
                <button
                  className="dropdown-toggle"
                  data-dropdown-button-id={habit.id}
                  onClick={() => setDropdownOpenId(dropdownOpenId === habit.id ? null : habit.id)}
                >
                  ⋮
                </button>
                {dropdownOpenId === habit.id && (
                  <div className="dropdown-menu" data-dropdown-menu-id={habit.id}>
                    <button onClick={() => startEditHabit(habit)}>Editar</button>
                    <button onClick={() => confirmDeleteHabit(habit)}>Excluir</button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <h1>Relatórios</h1>

      <div style={{ marginTop: '40px' }}>
        <h2>Gráfico dos Últimos 4 Dias</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={last4DaysData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            {habits.map(habit => (
              <Bar
                key={habit.id}
                dataKey={habit.name}
                fill="#007bff"
              />
            ))}
          </BarChart>
        </ResponsiveContainer>

        <h2 style={{ marginTop: '40px' }}>Gráfico Mensal</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#28a745" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {showModal && (
          <div className="modal" onClick={(e) => { if(e.target.className === 'modal') setShowModal(false); }}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h3>{editHabit ? 'Editar Hábito' : 'Cadastrar Hábito'}</h3>

              <label htmlFor="habitName">Nome do hábito</label>
              <input
                id="habitName"
                value={newHabit}
                onChange={(e) => setNewHabit(e.target.value)}
                placeholder="Digite o nome do hábito"
              />

              <label htmlFor="habitCategory">Categoria</label>
              <select
                id="habitCategory"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              >
                {CATEGORIES.map(cat => (
                  <option key={cat.label} value={cat.label}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>

              <label htmlFor="habitTarget">Alvo diário</label>
              <input
                id="habitTarget"
                type="number"
                min="1"
                value={newTarget}
                onChange={(e) => setNewTarget(e.target.value)}
                placeholder="Quantidade de vezes por dia"
              />

              <div className="modal-buttons">
                <button onClick={editHabit ? saveEditHabit : addHabit}>
                  Salvar
                </button>
                <button onClick={() => setShowModal(false)}>Cancelar</button>
              </div>
            </div>
          </div>
        )}

      {showDeleteModal && (
        <div className="modal" onClick={(e) => { if (e.target.className === 'modal') setShowDeleteModal(false); }}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Excluir Hábito</h3>
            <p>Tem certeza que deseja excluir o hábito "{habitToDelete?.name}"?</p>
            <div className="modal-buttons">
              <button className="btn-danger" onClick={deleteHabit}>Excluir</button>
              <button onClick={() => setShowDeleteModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;