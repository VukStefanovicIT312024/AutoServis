import { useEffect, useState } from "react";
import { Badge, Button, Card, Container, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AppointmentsPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const savedAppointments = localStorage.getItem("autoservisAppointments");
    const allAppointments = savedAppointments
      ? JSON.parse(savedAppointments)
      : [];

    if (user) {
      const userAppointments = allAppointments.filter(
        (appointment) => appointment.userEmail === user.email
      );

      setAppointments(userAppointments);
    }
  }, [user]);

  function cancelAppointment(id) {
    const savedAppointments = localStorage.getItem("autoservisAppointments");
    const allAppointments = savedAppointments
      ? JSON.parse(savedAppointments)
      : [];

    const updatedAppointments = allAppointments.map((appointment) =>
      appointment.id === id
        ? { ...appointment, status: "Otkazano" }
        : appointment
    );

    localStorage.setItem(
      "autoservisAppointments",
      JSON.stringify(updatedAppointments)
    );

    const userAppointments = updatedAppointments.filter(
      (appointment) => appointment.userEmail === user.email
    );

    setAppointments(userAppointments);
  }

  if (!user) {
    return (
      <Container className="py-5">
        <Card className="info-card">
          <Card.Body>
            <p className="section-label">Zaštićena stranica</p>
            <h1>Moja zakazivanja</h1>
            <p>
              Da biste pregledali svoja zakazivanja, potrebno je da se prvo
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
        <h1>Moja zakazivanja</h1>
        <p>Pregledajte zakazane termine i status svojih servisnih usluga.</p>
      </div>

      <Card className="table-card">
        <Card.Body>
          {appointments.length === 0 ? (
            <div>
              <p>Još uvek nemate zakazane termine.</p>

              <Button as={Link} to="/zakazivanje" variant="danger">
                Zakaži termin
              </Button>
            </div>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Usluga</th>
                  <th>Vozilo</th>
                  <th>Datum</th>
                  <th>Vreme</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td>{appointment.serviceName}</td>
                    <td>
                      {appointment.vehicleName}
                      <br />
                      <small>{appointment.plateNumber}</small>
                    </td>
                    <td>{appointment.date}</td>
                    <td>{appointment.time}</td>
                    <td>
                      <Badge
                        bg={
                          appointment.status === "Zakazano"
                            ? "success"
                            : "secondary"
                        }
                      >
                        {appointment.status}
                      </Badge>
                    </td>
                    <td className="text-end">
                      {appointment.status === "Zakazano" && (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => cancelAppointment(appointment.id)}
                        >
                          Otkaži
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
    </Container>
  );
}

export default AppointmentsPage;