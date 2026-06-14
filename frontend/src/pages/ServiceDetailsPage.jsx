import { Button, Container } from "react-bootstrap";
import { FaArrowLeft, FaCheck, FaClock } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import services from "../data/services";

function ServiceDetailsPage() {
  const { id } = useParams();
  const service = services.find((item) => item.id === Number(id));

  if (!service) {
    return (
      <Container className="py-5">
        <h1>Usluga nije pronađena</h1>
        <Button as={Link} to="/usluge" variant="dark">
          Nazad na usluge
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Button
        as={Link}
        to="/usluge"
        variant="link"
        className="px-0 mb-4 text-decoration-none"
      >
        <FaArrowLeft className="me-2" />
        Nazad na usluge
      </Button>

      <div className="service-details">
        <p className="section-label">{service.category}</p>
        <h1>{service.name}</h1>
        <p className="service-description">{service.description}</p>

        <div className="service-includes">
          <h2>Šta usluga obuhvata?</h2>

          <ul>
            {service.includes.map((item) => (
              <li key={item}>
                <FaCheck className="service-check" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p>
          <FaClock className="me-2 text-danger" />
          Trajanje: {service.duration} minuta
        </p>

        <h3 className="mb-4">
          Cena od {service.price.toLocaleString("sr-RS")} RSD
        </h3>

        <Button
  as={Link}
  to={`/zakazivanje?serviceId=${service.id}`}
  variant="danger"
  size="lg"
>
  Zakaži termin
</Button>
      </div>
    </Container>
  );
}

export default ServiceDetailsPage;