import { Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <section className="home-hero">
      <Container>
        <div className="home-hero-content">
          <p className="hero-label">Pouzdan servis za vaše vozilo</p>
          <h1>AutoServis</h1>
          <p>
            Pregledajte dostupne usluge i jednostavno zakažite termin
            za svoje vozilo.
          </p>

          <Button as={Link} to="/usluge" variant="danger" size="lg">
            Pregled usluga
          </Button>
        </div>
      </Container>
    </section>
  );
}

export default HomePage;