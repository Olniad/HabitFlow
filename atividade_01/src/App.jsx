import { useState, useEffect } from 'react';
import './App.css';

const CATEGORIES = [
  { label: 'Saúde', icon: '💧' },
  { label: 'Produtividade', icon: '📈' },
  { label: 'Leitura', icon: '📚' },
  { label: 'Bem-estar', icon: '🧘' }
];

function App() {
  const [habits, setHabits] = useState([
    { id: 1, name: 'Beber água', count: 0, category: 'Saúde' },
    { id: 2, name: 'Exercícios', count: 0, category: 'Saúde' },
    { id: 3, name: 'Estudar', count: 0, category: 'Produtividade' }
  ]);
  
  const [newHabit, setNewHabit] = useState('');
  const [newCategory, setNewCategory] = useState(CATEGORIES[0].label);
  const [showModal, setShowModal] = useState(false);
  const [dropdownOpenId, setDropdownOpenId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [habitToDelete, setHabitToDelete] = useState(null);
  const [editHabit, setEditHabit] = useState(null);
  const [filterCategory, setFilterCategory] = useState('Todas');

  useEffect(() => {
    function handleClickOutside(event) {
      // Se não tiver dropdown aberto, não precisa fazer nada
      if (dropdownOpenId === null) return;

      // Seleciona o botão dropdown que está aberto
      const dropdownButton = document.querySelector(
        `[data-dropdown-button-id="${dropdownOpenId}"]`
      );

      // Se clicou no botão, deixa aberto (toggle já feito no onClick)
      if (dropdownButton && dropdownButton.contains(event.target)) {
        return;
      }

      // Seleciona o menu dropdown aberto
      const dropdownMenu = document.querySelector(
        `[data-dropdown-menu-id="${dropdownOpenId}"]`
      );

      // Se clicou dentro do menu, não fecha
      if (dropdownMenu && dropdownMenu.contains(event.target)) {
        return;
      }

      // Se clicou fora, fecha o dropdown
      setDropdownOpenId(null);
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpenId]);

  const increment = (id) => {
    setHabits(habits.map(habit => 
      habit.id === id ? {...habit, count: habit.count + 1} : habit
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
    if (newHabit.trim()) {
      setHabits([...habits, {
        id: Date.now(),
        name: newHabit,
        category: newCategory,
        count: 0
      }]);
      setNewHabit('');
      setNewCategory(CATEGORIES[0].label);
      setShowModal(false);
    }
  };

  const startEditHabit = (habit) => {
    setEditHabit(habit);
    setNewHabit(habit.name);
    setNewCategory(habit.category);
    setShowModal(true);
    setDropdownOpenId(null);
  };

  const saveEditHabit = () => {
    if (newHabit.trim()) {
      setHabits(habits.map(habit =>
        habit.id === editHabit.id
          ? {...habit, name: newHabit, category: newCategory}
          : habit
      ));
      setEditHabit(null);
      setNewHabit('');
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

  // Filtra hábitos pela categoria selecionada
  const filteredHabits = filterCategory === 'Todas'
    ? habits
    : habits.filter(habit => habit.category === filterCategory);

  return (
    <div className="app">
      <h1>Meus Hábitos Diários</h1>
      
      <button className='btn-modal' onClick={() => {
        setShowModal(true);
        setEditHabit(null);
        setNewHabit('');
        setNewCategory(CATEGORIES[0].label);
      }}>+ Novo Hábito</button>

      {/* Filtro de categorias */}
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
        {filteredHabits.map(habit => (
          <div key={habit.id} className="habit-card">
            <span>{getIcon(habit.category)} {habit.name}</span>
              <div className="counter">
                <button className="btn decrement" onClick={() => decrement(habit.id)}>-</button>
                <span>{habit.count}</span>
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
        ))}
      </div>

      {/* Modal Cadastrar/Editar */}
      {showModal && (
        <div className="modal" onClick={(e) => { if(e.target.className === 'modal') setShowModal(false); }}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>{editHabit ? 'Editar Hábito' : 'Cadastrar Hábito'}</h3>
            <input
              value={newHabit}
              onChange={(e) => setNewHabit(e.target.value)}
              placeholder="Nome do hábito"
            />
            <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)}>
              {CATEGORIES.map(cat => (
                <option key={cat.label} value={cat.label}>
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>
            <div className="modal-buttons">
              <button onClick={editHabit ? saveEditHabit : addHabit}>
                {editHabit ? 'Salvar' : 'Salvar'}
              </button>
              <button onClick={() => setShowModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Excluir */}
      {showDeleteModal && (
        <div className="modal" onClick={(e) => { if(e.target.className === 'modal') setShowDeleteModal(false); }}>
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