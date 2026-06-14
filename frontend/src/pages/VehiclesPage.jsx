import { useEffect, useState } from "react";
import { Alert, Button, Card, Col, Container, Form, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function VehiclesPage() {
  const { user } = useAuth();

  const [vehicles, setVehicles] = useState([]);
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [plateNumber, setPlateNumber] = useState("");
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

  function saveVehicles(updatedUserVehicles) {
    const savedVehicles = localStorage.getItem("autoservisVehicles");
    const allVehicles = savedVehicles ? JSON.parse(savedVehicles) : [];

    const otherUsersVehicles = allVehicles.filter(
      (vehicle) => vehicle.ownerEmail !== user.email
    );

    const updatedAllVehicles = [...otherUsersVehicles, ...updatedUserVehicles];

    localStorage.setItem("autoservisVehicles", JSON.stringify(updatedAllVehicles));
    setVehicles(updatedUserVehicles);
  }

  function submitHandler(event) {
    event.preventDefault();

    if (!brand || !model || !year || !plateNumber) {
      setError("Sva polja su obavezna.");
      return;
    }

    if (Number(year) < 1980 || Number(year) > 2026) {
      setError("Godina proizvodnje mora biti između 1980. i 2026.");
      return;
    }

    const newVehicle = {
      id: Date.now(),
      brand,
      model,
      year,
      plateNumber,
      ownerEmail: user.email,
    };

    const updatedVehicles = [...vehicles, newVehicle];

    saveVehicles(updatedVehicles);

    setBrand("");
    setModel("");
    setYear("");
    setPlateNumber("");
    setError("");
  }

  function deleteVehicle(id) {
    const updatedVehicles = vehicles.filter((vehicle) => vehicle.id !== id);
    saveVehicles(updatedVehicles);
  }

  if (!user) {
    return (
      <Container className="py-5">
        <Card className="info-card">
          <Card.Body>
            <p className="section-label">Zaštićena stranica</p>
            <h1>Moja vozila</h1>
            <p>
              Da biste dodali i pregledali svoja vozila, potrebno je da se prvo
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

  return (
    <Container className="py-5">
      <div className="page-heading">
        <p className="section-label">Korisnički deo</p>
        <h1>Moja vozila</h1>
        <p>
          Dodajte vozila za koja želite da zakažete servis, popravku ili drugu
          uslugu.
        </p>
      </div>

      <Row className="g-4">
        <Col lg={5}>
          <Card className="form-card">
            <Card.Body>
              <h2>Dodavanje vozila</h2>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={submitHandler}>
                <Form.Group className="mb-3">
                  <Form.Label>Marka vozila</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Na primer: Volkswagen"
                    value={brand}
                    onChange={(event) => setBrand(event.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Model</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Na primer: Golf 7"
                    value={model}
                    onChange={(event) => setModel(event.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Godina proizvodnje</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Na primer: 2018"
                    value={year}
                    onChange={(event) => setYear(event.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Registarska oznaka</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Na primer: NS-123-AA"
                    value={plateNumber}
                    onChange={(event) => setPlateNumber(event.target.value)}
                  />
                </Form.Group>

                <Button type="submit" variant="danger" className="w-100">
                  Sačuvaj vozilo
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={7}>
          <Card className="table-card">
            <Card.Body>
              <h2>Lista vozila</h2>

              {vehicles.length === 0 ? (
                <p className="mb-0">Još uvek nemate dodata vozila.</p>
              ) : (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Marka</th>
                      <th>Model</th>
                      <th>Godina</th>
                      <th>Registracija</th>
                      <th></th>
                    </tr>
                  </thead>

                  <tbody>
                    {vehicles.map((vehicle) => (
                      <tr key={vehicle.id}>
                        <td>{vehicle.brand}</td>
                        <td>{vehicle.model}</td>
                        <td>{vehicle.year}</td>
                        <td>{vehicle.plateNumber}</td>
                        <td className="text-end">
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => deleteVehicle(vehicle.id)}
                          >
                            Obriši
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default VehiclesPage;