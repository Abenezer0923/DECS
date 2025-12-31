# DECS Backend

## Getting Started

### Prerequisites
*   Docker
*   Docker Compose

### Running the Application

1.  Build and start the containers:
    ```bash
    docker-compose up --build
    ```

2.  The API will be available at `http://localhost:3000`.

3.  The Database is accessible at `localhost:5432`.

### Development

*   The `src` folder is mounted into the container, so changes will trigger a restart (via `nodemon`).
*   To run commands inside the container (e.g., Prisma migrations):
    ```bash
    docker-compose exec api <command>
    ```
