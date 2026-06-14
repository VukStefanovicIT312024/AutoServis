import { useEffect, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Table,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import services from "../data/services";

function AdminPage() {
  const { user } = useAuth();

  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const savedUsers = localStorage.getItem("autoservisUsers");
    const savedAppointments = localStorage.getItem("autoservisAppointments");

    setUsers(savedUsers ? JSON.parse(savedUsers) : []);
    setAppointments(savedAppointments ? JSON.parse(savedAppointments) : []);
  }, []);

  function deleteUser(email) {
    const updatedUsers = users.filter((item) => item.email !== email);

    localStorage.setItem("autoservisUsers", JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
  }

  function changeAppointmentStatus(id, status) {
    const updatedAppointments = appointments.map((appointment) =>
      appointment.id === id ? { ...appointment, status } : appointment
    );

    localStorage.setItem(
      "autoservisAppointments",
      JSON.stringify(updatedAppointments)
    );

    setAppointments(updatedAppointments);
  }

  if (!user) {
    return (
      <Container className="py-5">
        <Card className="info-card">
          <Card.Body>
            <p className="section-label">Administratorski panel</p>
            <h1>Pristup nije dozvoljen</h1>
            <p>Da biste pristupili admin panelu, potrebno je da se prijavite.</p>

            <Button as={Link} to="/prijava" variant="danger">
              Prijava
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  if (user.role !== "admin") {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          Nemate administratorska prava za pristup ovoj stranici.
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <div className="page-heading">
        <p className="section-label">Administracija sistema</p>
        <h1>Admin panel</h1>
        <p>
          Pregled korisnika, usluga i svih zakazanih termina u aplikaciji.
        </p>
      </div>

      <Row className="g-4 mb-4">
        <Col md={4}>
          <Card className="stat-card">
            <Card.Body>
              <p>Korisnici</p>
              <h2>{users.length}</h2>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="stat-card">
            <Card.Body>
              <p>Usluge</p>
              <h2>{services.length}</h2>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="stat-card">
            <Card.Body>
              <p>Zakazivanja</p>
              <h2>{appointments.length}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="table-card mb-4">
        <Card.Body>
          <h2>Korisnici sistema</h2>

          {users.length === 0 ? (
            <p>Nema registrovanih korisnika.</p>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Ime</th>
                  <th>Email</th>
                  <th>Uloga</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {users.map((item) => (
                  <tr key={item.email}>
                    <td>{item.name}</td>
                    <td>{item.email}</td>
                    <td>
                      <Badge bg={item.role === "admin" ? "dark" : "secondary"}>
                        {item.role === "admin" ? "Administrator" : "Korisnik"}
                      </Badge>
                    </td>
                    <td className="text-end">
                      {item.role !== "admin" && (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => deleteUser(item.email)}
                        >
                          Obriši
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <Card className="table-card mb-4">
        <Card.Body>
          <h2>Usluge autoservisa</h2>

          <Table responsive hover>
            <thead>
              <tr>
                <th>Naziv</th>
                <th>Kategorija</th>
                <th>Trajanje</th>
                <th>Cena</th>
              </tr>
            </thead>

            <tbody>
              {services.map((service) => (
                <tr key={service.id}>
                  <td>{service.name}</td>
                  <td>{service.category}</td>
                  <td>{service.duration} min</td>
                  <td>{service.price.toLocaleString("sr-RS")} RSD</td>
                </tr>
              ))}
            </tbody>
          </Table>

          <p className="admin-note">
            U KT2 usluge se prikazuju iz frontend podataka, dok će u KT3 biti
            povezane sa MongoDB bazom i REST API rutama.
          </p>
        </Card.Body>
      </Card>

      <Card className="table-card">
        <Card.Body>
          <h2>Sva zakazivanja</h2>

          {appointments.length === 0 ? (
            <p>Nema zakazanih termina.</p>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Korisnik</th>
                  <th>Usluga</th>
                  <th>Vozilo</th>
                  <th>Datum</th>
                  <th>Vreme</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td>
                      {appointment.userName}
                      <br />
                      <small>{appointment.userEmail}</small>
                    </td>
                    <td>{appointment.serviceName}</td>
                    <td>
                      {appointment.vehicleName}
                      <br />
                      <small>{appointment.plateNumber}</small>
                    </td>
                    <td>{appointment.date}</td>
                    <td>{appointment.time}</td>
                    <td>
                      <Form.Select
                        size="sm"
                        value={appointment.status}
                        onChange={(event) =>
                          changeAppointmentStatus(
                            appointment.id,
                            event.target.value
                          )
                        }
                      >
                        <option value="Zakazano">Zakazano</option>
                        <option value="U obradi">U obradi</option>
                        <option value="Završeno">Završeno</option>
                        <option value="Otkazano">Otkazano</option>
                      </Form.Select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default AdminPage;