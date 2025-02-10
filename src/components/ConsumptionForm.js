import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs';

const ConsumptionForm = ({
  show,
  onHide,
  onSubmit,
  consumption,
  consumptions,
  onNext,
  onPrevious,
}) => {
  const [id, setId] = useState('');
  const [consumptionValue, setConsumptionValue] = useState('');
  const [month, setMonth] = useState('');
  const [price, setPrice] = useState('');

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ];

  useEffect(() => {
    if (consumption) {
      // Si hay un consumo seleccionado (modo edición), llena el formulario con sus datos
      setId(consumption.id);
      setConsumptionValue(consumption.consumption);
      setMonth(consumption.month);
      setPrice(consumption.price);
    } else {
      // Si no hay un consumo seleccionado (modo agregar), limpia el formulario
      setId('');
      setConsumptionValue('');
      setMonth('');
      setPrice('');
    }
  }, [consumption]);

  const handleSubmit = () => {
    // Envía los datos del formulario al componente padre
    onSubmit({
      id, // Incluye el ID en los datos enviados
      consumption: consumptionValue,
      month,
      price: parseFloat(price),
    });
    onHide(); // Cierra el modal
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{consumption ? 'Editar Consumo' : 'Agregar Consumo'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Consumo (kWh)</Form.Label>
            <Form.Control
              type="number"
              value={consumptionValue}
              onChange={(e) => setConsumptionValue(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Mes</Form.Label>
            <Form.Select value={month} onChange={(e) => setMonth(e.target.value)}>
              <option value="">Selecciona un mes</option>
              {months.map((mes) => (
                <option key={mes} value={mes}>
                  {mes}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group>
            <Form.Label>Precio (kWh)</Form.Label>
            <Form.Control
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cerrar
        </Button>
        {consumption && (
          <>
            <Button variant="light" onClick={onPrevious} disabled={!onPrevious}>
              <BsArrowLeft />
            </Button>
            <Button variant="light" onClick={onNext} disabled={!onNext}>
              <BsArrowRight />
            </Button>
          </>
        )}
        <Button variant="primary" onClick={handleSubmit}>
          {consumption ? 'Guardar' : 'Añadir'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConsumptionForm;