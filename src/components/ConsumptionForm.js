import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs';

const ConsumptionForm = ({  show,
  onHide,
  onSubmit,
  consumption,
  consumptions,
  onNext,
  onPrevious,
  maxConsumptions,
  selectedIndex, // <-- Añade esta línea
}) => {
  const [id, setId] = useState('');
  const [consumptionValue, setConsumptionValue] = useState('');
  const [month, setMonth] = useState('');
  const [price, setPrice] = useState('');

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ];

  // Función para obtener el siguiente mes
  const getNextMonth = () => {
  if (consumptions.length === 0) {
    // Si es el primer consumo, obtener mes actual
    const currentDate = new Date();
    const currentMonthIndex = currentDate.getMonth(); // 0 (Enero) - 11 (Diciembre)
    return months[currentMonthIndex];
  }
  // Lógica existente para meses siguientes
  const lastMonth = consumptions[consumptions.length - 1].month;
  const lastIndex = months.indexOf(lastMonth);
  return months[(lastIndex + 1) % 12];
};

  useEffect(() => {
    if (consumption) {
      // Si hay un consumo seleccionado (modo edición), llena el formulario con sus datos
      setId(consumption.id);
      setConsumptionValue(consumption.consumption);
      setMonth(consumption.month);
      setPrice(consumption.price.toFixed(2));
    } else {
      // Si no hay un consumo seleccionado (modo agregar), limpia el formulario y establece el siguiente mes
      setId('');
      setConsumptionValue('');
      setMonth(getNextMonth());
      setPrice('');
    }
  }, [consumption, consumptions]);

  const handleSubmit = () => {
    // Validar que todos los campos estén completos
    if (!consumptionValue || !month || !price) {
      alert('Todos los campos son obligatorios.');
      return;
    }
    const numericConsumption = parseFloat(consumptionValue);
    const numericPrice = parseFloat(price);

    // Envía los datos del formulario al componente padre
    onSubmit({
      id, // Incluye el ID en los datos enviados
      consumption: numericConsumption,
      month,
      price: numericPrice,
    });

    if (!consumption && consumptions.length + 1 < maxConsumptions) {
      // Si estamos añadiendo un nuevo consumo y no hemos alcanzado el límite, limpia el formulario
      setId('');
      setConsumptionValue('');
      setMonth(getNextMonth());
      setPrice('');
    } else {
      onHide(); // Cierra el modal si se alcanza el límite o se está editando
    }
  };

  const isEditing = !!consumption; // Verifica si estamos en modo edición

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{isEditing ? 'Editar Consumo' : 'Agregar Consumo'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Mes</Form.Label>
            <Form.Select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              required
            >
              <option value="">Selecciona un mes</option>
              {months.map((mes) => (
                <option key={mes} value={mes}>
                  {mes}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group>
            <Form.Label>Consumo (kWh)</Form.Label>
            <Form.Control
              type="number"
              value={consumptionValue}
              step="0.01"
              onChange={(e) => setConsumptionValue(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Precio (kWh)</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        {/* Flecha hacia atrás: visible siempre que haya consumos */}
        {consumptions.length > 0 && (
          <Button variant="light" onClick={onPrevious}>
            <BsArrowLeft />
          </Button>
        )}

        {/* Flecha hacia adelante: visible solo en modo edición */}
        {consumption && selectedIndex < consumptions.length - 1 && (
          <Button variant="light" onClick={onNext}>
            <BsArrowRight />
          </Button>
        )}

        <Button variant="secondary" onClick={onHide}>
          Cerrar
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSubmit} 
          disabled={!consumptionValue || !month || !price}
        >
          {consumption || consumptions.length >= maxConsumptions ? 'Guardar' : '+ Añadir Nuevo'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConsumptionForm;