import React, { useState } from 'react';
import './App.css';
import { Button, Container, Row } from 'react-bootstrap';
import ConsumptionTable from './components/ConsumptionTable';
import ConsumptionForm from './components/ConsumptionForm';

function App() {
  const [consumptions, setConsumptions] = useState([]); // Inicialmente no hay consumos
  const [showForm, setShowForm] = useState(false);
  const [selectedConsumption, setSelectedConsumption] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const handleDelete = (id) => {
    setConsumptions(consumptions.filter((consumption) => consumption.id !== id));
  };

  const handleEdit = (consumption) => {
    const index = consumptions.findIndex((c) => c.id === consumption.id);
    setSelectedConsumption(consumption);
    setSelectedIndex(index);
    setShowForm(true);
  };

  const handleSubmit = (consumption) => {
    if (selectedConsumption) {
      // Modo edición
      setConsumptions(
        consumptions.map((c) => (c.id === consumption.id ? consumption : c))
      );
    } else {
      // Modo agregar
      if (consumptions.length >= 13) {
        alert('No se pueden agregar más de 13 consumos.');
        return;
      }
      setConsumptions([...consumptions, { ...consumption, id: Date.now() }]);
    }
    setSelectedConsumption(null);
    setSelectedIndex(null);
  };

  const handleNext = () => {
    if (selectedIndex < consumptions.length - 1) {
      const nextIndex = selectedIndex + 1;
      setSelectedIndex(nextIndex);
      setSelectedConsumption(consumptions[nextIndex]);
    }
  };

  const handlePrevious = () => {
    if (selectedIndex > 0) {
      const prevIndex = selectedIndex - 1;
      setSelectedIndex(prevIndex);
      setSelectedConsumption(consumptions[prevIndex]);
    }
  };

  return (
    <>
      <header className="App-header">
        <Container className="mt-5">
          <Row className="p-4">
            <h1>Añade los Consumos</h1>
            <ConsumptionTable
              consumptions={consumptions}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onAddNew={() => {
                setSelectedConsumption(null);
                setShowForm(true);
              }}
            />
            {consumptions.length > 0 && consumptions.length < 13 && (
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
            />
          </Row>
        </Container>
      </header>
    </>
  );
}

export default App;