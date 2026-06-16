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
  Spinner,
  Table,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { API_URL } from "../config";
import { useAuth } from "../context/AuthContext";

function AdminPage() {
  const { user } = useAuth();

  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAdminData() {
      if (!user || user.role !== "admin") {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const headers = {
          Authorization: `Bearer ${user.token}`,
        };

        const [usersResponse, servicesResponse, appointmentsResponse] =
          await Promise.all([
            fetch(`${API_URL}/api/users`, { headers }),
            fetch(`${API_URL}/api/services`),
            fetch(`${API_URL}/api/appointments/admin`, { headers }),
          ]);

        const usersData = await usersResponse.json();
        const servicesData = await servicesResponse.json();
        const appointmentsData = await appointmentsResponse.json();

        if (!usersResponse.ok) {
          throw new Error(usersData.message || "Greška pri učitavanju korisnika.");
        }

        if (!servicesResponse.ok) {
          throw new Error(servicesData.message || "Greška pri učitavanju usluga.");
        }

        if (!appointmentsResponse.ok) {
          throw new Error(
            appointmentsData.message || "Greška pri učitavanju zakazivanja."
          );
        }

        setUsers(usersData);
        setServices(servicesData);
        setAppointments(appointmentsData);
        setError("");
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAdminData();
  }, [user]);

  async function deleteUser(id) {
    try {
      const response = await fetch(`${API_URL}/api/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Brisanje korisnika nije uspelo.");
      }

      setUsers(users.filter((item) => item._id !== id));
      setError("");
    } catch (error) {
      setError(error.message);
    }
  }

  async function changeAppointmentStatus(id, status) {
    try {
      const response = await fetch(`${API_URL}/api/appointments/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Promena statusa nije uspela.");
      }

      setAppointments(
        appointments.map((appointment) =>
          appointment._id === id ? { ...appointment, status: data.status } : appointment
        )
      );
      setError("");
    } catch (error) {
      setError(error.message);
    }
  }

  function getStatusLabel(status) {
    const labels = {
      zakazano: "Zakazano",
      u_obradi: "U obradi",
      zavrseno: "Završeno",
      otkazano: "Otkazano",
    };

    return labels[status] || status;
  }

  function getStatusVariant(status) {
    if (status === "zakazano") return "success";
    if (status === "u_obradi") return "warning";
    if (status === "zavrseno") return "primary";
    return "secondary";
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

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="danger" />
        <p className="mt-3">Učitavanje admin panela...</p>
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

      {error && <Alert variant="danger">{error}</Alert>}

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
                  <tr key={item._id}>
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
                          onClick={() => deleteUser(item._id)}
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
                <tr key={service._id}>
                  <td>{service.name}</td>
                  <td>{service.category}</td>
                  <td>{service.duration} min</td>
                  <td>{service.price.toLocaleString("sr-RS")} RSD</td>
                </tr>
              ))}
            </tbody>
          </Table>
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
                  <tr key={appointment._id}>
                    <td>
                      {appointment.user?.name}
                      <br />
                      <small>{appointment.user?.email}</small>
                    </td>
                    <td>{appointment.service?.name}</td>
                    <td>
                      {appointment.vehicle?.brand} {appointment.vehicle?.model}
                      <br />
                      <small>{appointment.vehicle?.plateNumber}</small>
                    </td>
                    <td>{appointment.date}</td>
                    <td>{appointment.time}</td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <Badge bg={getStatusVariant(appointment.status)}>
                          {getStatusLabel(appointment.status)}
                        </Badge>

                        <Form.Select
                          size="sm"
                          value={appointment.status}
                          onChange={(event) =>
                            changeAppointmentStatus(
                              appointment._id,
                              event.target.value
                            )
                          }
                        >
                          <option value="zakazano">Zakazano</option>
                          <option value="u_obradi">U obradi</option>
                          <option value="zavrseno">Završeno</option>
                          <option value="otkazano">Otkazano</option>
                        </Form.Select>
                      </div>
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