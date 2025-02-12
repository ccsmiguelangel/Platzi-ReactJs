import React, { useState } from 'react';
import './App.css';
import { Button, Container, Row } from 'react-bootstrap';
import ConsumptionTable from './components/ConsumptionTable';
import ConsumptionForm from './components/ConsumptionForm';

function App() {
  const [consumptions, setConsumptions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedConsumption, setSelectedConsumption] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const maxConsumptions = 13;

  const handleDelete = (id) => {
    setConsumptions(consumptions.filter((c) => c.id !== id));
  };

  const handleEdit = (consumption) => {
    const index = consumptions.findIndex((c) => c.id === consumption.id);
    setSelectedConsumption(consumption);
    setSelectedIndex(index);
    setShowForm(true);
  };

  const handleSubmit = (consumption) => {
    if (consumption.id) {
      // Editar consumo existente
      setConsumptions(consumptions.map((c) => (c.id === consumption.id ? consumption : c)))
    } else {
      // Añadir nuevo consumo
      if (consumptions.length >= maxConsumptions) {
        alert('No se pueden agregar más de 13 consumos.');
        return;
      }
      setConsumptions([...consumptions, { ...consumption, id: Date.now() }]);
    }
    setSelectedConsumption(null);
  };

  const handleNext = () => {
    if (selectedIndex < consumptions.length - 1) {
      const nextIndex = selectedIndex + 1;
      setSelectedIndex(nextIndex);
      setSelectedConsumption(consumptions[nextIndex]);
    }
  };

  const handlePrevious = () => {
    if (selectedConsumption) {
      // Modo edición: navegar al anterior
      if (selectedIndex > 0) {
        const prevIndex = selectedIndex - 1;
        setSelectedIndex(prevIndex);
        setSelectedConsumption(consumptions[prevIndex]);
      }
    } else {
      // Modo añadir: navegar al último consumo
      if (consumptions.length > 0) {
        const lastIndex = consumptions.length - 1;
        setSelectedIndex(lastIndex);
        setSelectedConsumption(consumptions[lastIndex]);
      }
    }
  };

  return (
    <header className="App-header">
      <Container className="mt-3">
        <Row className="p-4">
          <h1 className="text-center mb-4">Calculadora de Consumos</h1>
          <ConsumptionTable
            consumptions={consumptions}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onAddNew={() => {
              setSelectedConsumption(null);
              setShowForm(true);
            }}
          />
          {consumptions.length > 0 && consumptions.length < maxConsumptions && (
            <Button variant="primary" onClick={() => setShowForm(true)} className="mb-3">
              + Nuevo
            </Button>
          )}
          <ConsumptionForm
            show={showForm}
            onHide={() => {
              setShowForm(false);
              setSelectedConsumption(null);
              setSelectedIndex(null);
            }}
            onSubmit={handleSubmit}
            consumption={selectedConsumption}
            consumptions={consumptions}
            onNext={handleNext}
            onPrevious={handlePrevious}
            maxConsumptions={maxConsumptions}
            selectedIndex={selectedIndex} // <-- Añade esta línea
          />
        </Row>
      </Container>
    </header>
  );
}

export default App;