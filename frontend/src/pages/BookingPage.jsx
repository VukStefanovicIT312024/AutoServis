import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
} from "react-bootstrap";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import services from "../data/services";
import { useAuth } from "../context/AuthContext";

function BookingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const selectedServiceId = searchParams.get("serviceId");

  const [vehicles, setVehicles] = useState([]);
  const [serviceId, setServiceId] = useState(selectedServiceId || "");
  const [vehicleId, setVehicleId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const savedVehicles = localStorage.getItem("autoservisVehicles");
    const allVehicles = savedVehicles ? JSON.parse(savedVehicles) : [];

    if (user) {
      const userVehicles = allVehicles.filter(
        (vehicle) => vehicle.ownerEmail === user.email
      );

      setVehicles(userVehicles);
    }
  }, [user]);

  function submitHandler(event) {
    event.preventDefault();

    if (!serviceId || !vehicleId || !date || !time) {
      setError("Usluga, vozilo, datum i vreme su obavezni.");
      return;
    }

    const selectedService = services.find(
      (service) => service.id === Number(serviceId)
    );

    const selectedVehicle = vehicles.find(
      (vehicle) => vehicle.id === Number(vehicleId)
    );

    const newAppointment = {
      id: Date.now(),
      userEmail: user.email,
      userName: user.name,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      vehicleId: selectedVehicle.id,
      vehicleName: `${selectedVehicle.brand} ${selectedVehicle.model}`,
      plateNumber: selectedVehicle.plateNumber,
      date,
      time,
      description,
      status: "Zakazano",
    };

    const savedAppointments = localStorage.getItem("autoservisAppointments");
    const appointments = savedAppointments
      ? JSON.parse(savedAppointments)
      : [];

    const updatedAppointments = [...appointments, newAppointment];

    localStorage.setItem(
      "autoservisAppointments",
      JSON.stringify(updatedAppointments)
    );

    navigate("/moja-zakazivanja");
  }

  if (!user) {
    return (
      <Container className="py-5">
        <Card className="info-card">
          <Card.Body>
            <p className="section-label">Zaštićena funkcionalnost</p>
            <h1>Zakazivanje termina</h1>
            <p>
              Da biste zakazali servisnu uslugu, potrebno je da se prvo
              prijavite.
            </p>

            <Button as={Link} to="/prijava" variant="danger">
              Prijava
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  if (vehicles.length === 0) {
    return (
      <Container className="py-5">
        <Card className="info-card">
          <Card.Body>
            <p className="section-label">Nedostaje vozilo</p>
            <h1>Zakazivanje termina</h1>
            <p>
              Pre zakazivanja potrebno je da dodate makar jedno vozilo na svoj
              nalog.
            </p>

            <Button as={Link} to="/moja-vozila" variant="danger">
              Dodaj vozilo
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <div className="page-heading">
        <p className="section-label">Online zakazivanje</p>
        <h1>Zakažite termin</h1>
        <p>
          Izaberite uslugu, vozilo, datum i vreme dolaska u autoservis.
        </p>
      </div>

      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="form-card">
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={submitHandler}>
                <Form.Group className="mb-3">
                  <Form.Label>Usluga</Form.Label>
                  <Form.Select
                    value={serviceId}
                    onChange={(event) => setServiceId(event.target.value)}
                  >
                    <option value="">Izaberite uslugu</option>
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name} - {service.price.toLocaleString("sr-RS")} RSD
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Vozilo</Form.Label>
                  <Form.Select
                    value={vehicleId}
                    onChange={(event) => setVehicleId(event.target.value)}
                  >
                    <option value="">Izaberite vozilo</option>
                    {vehicles.map((vehicle) => (
                      <option key={vehicle.id} value={vehicle.id}>
                        {vehicle.brand} {vehicle.model} - {vehicle.plateNumber}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Datum</Form.Label>
                      <Form.Control
                        type="date"
                        value={date}
                        onChange={(event) => setDate(event.target.value)}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Vreme</Form.Label>
                      <Form.Select
                        value={time}
                        onChange={(event) => setTime(event.target.value)}
                      >
                        <option value="">Izaberite vreme</option>
                        <option value="08:00">08:00</option>
                        <option value="09:00">09:00</option>
                        <option value="10:00">10:00</option>
                        <option value="11:00">11:00</option>
                        <option value="12:00">12:00</option>
                        <option value="13:00">13:00</option>
                        <option value="14:00">14:00</option>
                        <option value="15:00">15:00</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-4">
                  <Form.Label>Opis problema ili napomena</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Na primer: čuje se zvuk pri kočenju..."
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                  />
                </Form.Group>

                <Button type="submit" variant="danger" size="lg">
                  Potvrdi zakazivanje
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default BookingPage;