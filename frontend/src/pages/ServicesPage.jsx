import { useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import ServiceCard from "../components/ServiceCard";
import services from "../data/services";

function ServicesPage() {
  const [search, setSearch] = useState("");

  const filteredServices = services.filter((service) => {
    const searchValue = search.toLowerCase();

    return (
      service.name.toLowerCase().includes(searchValue) ||
      service.category.toLowerCase().includes(searchValue) ||
      service.description.toLowerCase().includes(searchValue)
    );
  });

  return (
    <Container className="py-5">
      <div className="page-heading">
        <p className="section-label">Ponuda servisa</p>
        <h1>Usluge autoservisa</h1>
        <p>Pronađite odgovarajuću uslugu za svoje vozilo.</p>
      </div>

      <Form.Control
        type="search"
        placeholder="Pretražite usluge..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        className="service-search mb-4"
      />

      <Row className="g-4">
        {filteredServices.map((service) => (
          <Col key={service.id} sm={12} md={6} lg={4}>
            <ServiceCard service={service} />
          </Col>
        ))}
      </Row>

      {filteredServices.length === 0 && (
        <p className="text-center mt-5">Nema pronađenih usluga.</p>
      )}
    </Container>
  );
}

export default ServicesPage;