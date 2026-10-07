import { useState } from "react";

const roadmap = [
  {
    stage: "Stage 1",
    title: "Docker Fundamentals",
    duration: "Days 1–3",
    color: "#00D4FF",
    accent: "#003344",
    days: [
      {
        day: "Day 1",
        title: "What is Docker & Why It Exists",
        topics: [
          "Problems before Docker: 'works on my machine' syndrome",
          "VMs vs Containers — architecture differences",
          "Docker Engine, Docker Daemon, Docker CLI",
          "Install Docker Desktop (Windows/Mac) or Docker Engine (Linux)",
          "Run your first container: docker run hello-world",
          "Understand what happened: pull → create → run → stop",
        ],
        project: "Run hello-world, nginx, and ubuntu containers. Explore each.",
        commands: ["docker run", "docker ps", "docker ps -a", "docker images"],
      },
      {
        day: "Day 2",
        title: "Images & Containers Deep Dive",
        topics: [
          "Docker image layers — how they stack",
          "Image registry: Docker Hub, public vs private",
          "Pulling, tagging, and inspecting images",
          "Container lifecycle: create → start → stop → remove",
          "Interactive mode (-it) vs detached mode (-d)",
          "Port mapping with -p, name containers with --name",
        ],
        project: "Run an nginx server, map port 8080:80, view it in browser.",
        commands: ["docker pull", "docker run -it", "docker run -d -p", "docker stop", "docker rm", "docker rmi"],
      },
      {
        day: "Day 3",
        title: "Writing Your First Dockerfile",
        topics: [
          "Dockerfile syntax and instruction set",
          "FROM, RUN, COPY, ADD, WORKDIR, EXPOSE, CMD, ENTRYPOINT",
          "CMD vs ENTRYPOINT — key differences",
          "Build context and .dockerignore",
          "Build your image: docker build -t myapp .",
          "Layer caching — why order matters",
        ],
        project: "Dockerize a simple Node.js or Python 'Hello World' HTTP server.",
        commands: ["docker build", "docker build -t", "docker history", "docker inspect"],
      },
    ],
  },
  {
    stage: "Stage 2",
    title: "Data, Networking & Compose",
    duration: "Days 4–7",
    color: "#A855F7",
    accent: "#1a003a",
    days: [
      {
        day: "Day 4",
        title: "Volumes & Persistent Data",
        topics: [
          "Why containers are ephemeral by default",
          "Bind mounts vs Named volumes vs tmpfs",
          "Creating and managing named volumes",
          "Mount host directories into containers",
          "Volume drivers and when to use them",
          "Backup and restore volume data",
        ],
        project: "Run a PostgreSQL container with a named volume. Stop, remove, restart — data persists.",
        commands: ["docker volume create", "docker volume ls", "docker run -v", "docker run --mount"],
      },
      {
        day: "Day 5",
        title: "Docker Networking",
        topics: [
          "Docker network drivers: bridge, host, none, overlay",
          "Default bridge network limitations",
          "User-defined bridge networks — DNS resolution by name",
          "Container-to-container communication",
          "Exposing services to the host",
          "Inspecting networks",
        ],
        project: "Create a network, run a Node app + MongoDB on it. App connects to Mongo by container name.",
        commands: ["docker network create", "docker network ls", "docker network connect", "docker network inspect"],
      },
      {
        day: "Day 6",
        title: "Docker Compose — Basics",
        topics: [
          "Why Compose exists: managing multi-container apps",
          "docker-compose.yml structure: version, services, volumes, networks",
          "Define services, images, builds, ports, env vars",
          "depends_on and startup order",
          "docker compose up, down, logs, ps",
          "Overriding config with docker-compose.override.yml",
        ],
        project: "Write a Compose file for a React frontend + Node API + MongoDB stack.",
        commands: ["docker compose up -d", "docker compose down", "docker compose logs", "docker compose ps"],
      },
      {
        day: "Day 7",
        title: "Compose — Advanced Patterns",
        topics: [
          "Environment variables: .env files, env_file directive",
          "Health checks in Compose",
          "Scaling services with --scale",
          "Compose profiles for dev/test/prod environments",
          "Build args vs runtime env vars",
          "Restart policies: no, always, on-failure, unless-stopped",
        ],
        project: "Extend Day 6 project with health checks, .env config, and profiles for dev vs prod.",
        commands: ["docker compose --profile", "docker compose up --scale", "docker compose config"],
      },
    ],
  },
  {
    stage: "Stage 3",
    title: "Images at Scale & Registry",
    duration: "Days 8–11",
    color: "#22C55E",
    accent: "#002210",
    days: [
      {
        day: "Day 8",
        title: "Advanced Dockerfile Techniques",
        topics: [
          "Multi-stage builds — smaller production images",
          "Build-time ARGs for flexible images",
          "Using non-root users for security",
          "HEALTHCHECK instruction",
          "ONBUILD for base images",
          "Optimizing layer cache for CI speed",
        ],
        project: "Rewrite your Node/Python app Dockerfile using multi-stage build. Compare image sizes.",
        commands: ["docker build --target", "docker build --build-arg", "docker image prune"],
      },
      {
        day: "Day 9",
        title: "Image Optimization & Security",
        topics: [
          "Choosing the right base: alpine vs slim vs distroless",
          "Scanning images for vulnerabilities: docker scout / trivy",
          "Secrets management — never bake secrets into images",
          "Read-only filesystems and capability dropping",
          "Image signing with Docker Content Trust",
          "SBOM (Software Bill of Materials) basics",
        ],
        project: "Audit your image with trivy. Reduce image size below 50MB. Fix at least one CVE.",
        commands: ["docker scout cves", "docker run --read-only", "docker run --cap-drop"],
      },
      {
        day: "Day 10",
        title: "Working with Registries",
        topics: [
          "Docker Hub: push, pull, public/private repos",
          "Tagging strategy: latest, semver, git SHA",
          "GitHub Container Registry (ghcr.io)",
          "AWS ECR, GCP Artifact Registry, Azure ACR overview",
          "Running a local private registry",
          "Image retention and cleanup policies",
        ],
        project: "Push your multi-stage image to Docker Hub AND ghcr.io with proper tags.",
        commands: ["docker login", "docker tag", "docker push", "docker pull <registry>/<image>"],
      },
      {
        day: "Day 11",
        title: "Docker in CI/CD Pipelines",
        topics: [
          "GitHub Actions: build and push Docker images",
          "docker/build-push-action workflow",
          "Layer caching in CI with cache-from/cache-to",
          "Matrix builds for multi-platform images (amd64/arm64)",
          "Buildx and BuildKit features",
          "Running tests inside Docker in CI",
        ],
        project: "Create a GitHub Actions workflow: test → build → push image to ghcr.io on main branch.",
        commands: ["docker buildx build", "docker buildx create", "docker manifest inspect"],
      },
    ],
  },
  {
    stage: "Stage 4",
    title: "Orchestration & Production",
    duration: "Days 12–16",
    color: "#F59E0B",
    accent: "#2a1500",
    days: [
      {
        day: "Day 12",
        title: "Docker Swarm — Container Orchestration",
        topics: [
          "Why orchestration? Scaling, self-healing, rolling updates",
          "Swarm mode: managers and workers",
          "Initializing a swarm, joining nodes",
          "Services vs containers: replicas, constraints",
          "Rolling updates and rollbacks",
          "Swarm overlay networks and ingress",
        ],
        project: "Init a local swarm, deploy your app as a service with 3 replicas. Simulate a rolling update.",
        commands: ["docker swarm init", "docker service create", "docker service update", "docker service ls"],
      },
      {
        day: "Day 13",
        title: "Docker Stacks & Swarm Secrets",
        topics: [
          "Docker Stacks: Compose files for Swarm",
          "deploy key: replicas, resources, restart_policy, update_config",
          "Swarm secrets: securely injecting sensitive data",
          "Swarm configs for non-sensitive config files",
          "Placement constraints and node labels",
          "Global services vs replicated services",
        ],
        project: "Deploy a full stack (frontend + API + DB) using docker stack deploy with secrets for DB password.",
        commands: ["docker stack deploy", "docker secret create", "docker config create", "docker stack ps"],
      },
      {
        day: "Day 14",
        title: "Kubernetes Primer (from Docker lens)",
        topics: [
          "Docker vs Kubernetes — when to use which",
          "Kubernetes core objects: Pod, Deployment, Service, Ingress",
          "kubectl basics for Docker users",
          "Your Docker images run unchanged in K8s",
          "Local K8s: minikube or kind",
          "Helm charts as 'Compose for Kubernetes'",
        ],
        project: "Deploy your Docker image to minikube. Expose it via a NodePort Service.",
        commands: ["kubectl apply -f", "kubectl get pods", "kubectl describe", "kubectl logs"],
      },
      {
        day: "Day 15",
        title: "Monitoring & Observability",
        topics: [
          "Docker stats and resource constraints (--memory, --cpus)",
          "cgroups and namespaces under the hood",
          "Logging drivers: json-file, syslog, fluentd",
          "Centralized logging with Loki + Grafana via Compose",
          "Metrics with Prometheus + cAdvisor",
          "Container health monitoring best practices",
        ],
        project: "Set up a Compose stack with cAdvisor + Prometheus + Grafana. Monitor your app containers.",
        commands: ["docker stats", "docker run --memory", "docker run --log-driver", "docker events"],
      },
      {
        day: "Day 16",
        title: "Production Patterns & Best Practices",
        topics: [
          "12-Factor App methodology applied to Docker",
          "Graceful shutdown: SIGTERM handling in your app",
          "Zero-downtime deployments strategies",
          "Reverse proxy patterns: Traefik / Nginx as sidecar",
          "Docker in production checklist",
          "Debugging running containers in production safely",
        ],
        project: "Add Traefik reverse proxy to your stack with automatic routing. Implement SIGTERM handling.",
        commands: ["docker exec", "docker cp", "docker diff", "docker commit (when NOT to use it)"],
      },
    ],
  },
  {
    stage: "Stage 5",
    title: "Capstone Projects",
    duration: "Days 17–20",
    color: "#FF6B6B",
    accent: "#2a0000",
    days: [
      {
        day: "Days 17–18",
        title: "Capstone: Full-Stack App Deployment",
        topics: [
          "Dockerize a real app end-to-end (React + API + DB + Cache)",
          "Multi-stage builds for all services",
          "Docker Compose for local dev with hot reload",
          "Production Compose with resource limits and health checks",
          "CI/CD pipeline: GitHub Actions → ghcr.io → deploy",
          "Secrets management and environment separation",
        ],
        project: "Build and ship a Todo app or Blog platform: dev Compose + prod Compose + full CI/CD pipeline.",
        commands: ["Everything learned so far combined"],
      },
      {
        day: "Days 19–20",
        title: "Capstone: Microservices Architecture",
        topics: [
          "Split a monolith into 3+ microservices",
          "Each service has its own Dockerfile and image",
          "Service discovery via Docker networking / Swarm",
          "API Gateway pattern with Traefik",
          "Distributed logging across services",
          "Document your architecture with a README",
        ],
        project: "Deploy a 3-service microservices app (auth, products, orders) with shared monitoring stack.",
        commands: ["Full orchestration stack"],
      },
    ],
  },
];

const resources = [
  { label: "Official Docs", url: "docs.docker.com", icon: "📘" },
  { label: "Play with Docker", url: "labs.play-with-docker.com", icon: "🧪" },
  { label: "Docker Hub", url: "hub.docker.com", icon: "🐳" },
  { label: "Awesome Docker", url: "github.com/veggiemonk/awesome-docker", icon: "⭐" },
];

export default function DockerRoadmap() {
  const [activeStage, setActiveStage] = useState(0);
  const [activeDay, setActiveDay] = useState(0);
  const [tab, setTab] = useState("topics");

  const stage = roadmap[activeStage];
  const day = stage.days[activeDay];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0f",
      color: "#e8e8f0",
      fontFamily: "'Courier New', 'Lucida Console', monospace",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Header */}
      <div style={{
        borderBottom: "1px solid #1e1e2e",
        padding: "20px 28px",
        display: "flex",
        alignItems: "center",
        gap: 16,
        background: "linear-gradient(90deg, #0a0a0f 0%, #0d0d1a 100%)",
      }}>
        <div style={{
          width: 40, height: 40,
          background: "#00D4FF22",
          border: "1.5px solid #00D4FF",
          borderRadius: 8,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22,
        }}>🐳</div>
        <div>
          <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: 2, color: "#00D4FF" }}>
            DOCKER MASTERY ROADMAP
          </div>
          <div style={{ fontSize: 14, color: "#556", letterSpacing: 1 }}>
            SCRATCH → PRODUCTION · 20 DAYS · 5 STAGES
          </div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 12 }}>
          {resources.map(r => (
            <div key={r.label} style={{
              fontSize: 13, color: "#556", border: "1px solid #1e1e2e",
              borderRadius: 4, padding: "4px 8px", cursor: "default",
            }}>
              {r.icon} {r.label}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flex: 1 }}>
        {/* Left Sidebar - Stages */}
        <div style={{
          width: 220,
          borderRight: "1px solid #1e1e2e",
          padding: "20px 0",
          display: "flex",
          flexDirection: "column",
          gap: 4,
          background: "#08080e",
        }}>
          <div style={{ fontSize: 12, color: "#445", letterSpacing: 2, padding: "0 16px 12px" }}>
            STAGES
          </div>
          {roadmap.map((s, i) => (
            <button
              key={i}
              onClick={() => { setActiveStage(i); setActiveDay(0); setTab("topics"); }}
              style={{
                background: activeStage === i ? `${s.color}15` : "transparent",
                border: "none",
                borderLeft: activeStage === i ? `3px solid ${s.color}` : "3px solid transparent",
                color: activeStage === i ? s.color : "#445",
                padding: "10px 16px",
                textAlign: "left",
                cursor: "pointer",
                transition: "all 0.15s",
                fontSize: 13,
                letterSpacing: 0.5,
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: 2 }}>{s.stage}</div>
              <div style={{ fontSize: 11, opacity: 0.8 }}>{s.title}</div>
              <div style={{ fontSize: 12, opacity: 0.5, marginTop: 2 }}>{s.duration}</div>
            </button>
          ))}

          <div style={{ marginTop: "auto", padding: "16px", borderTop: "1px solid #1e1e2e" }}>
            <div style={{ fontSize: 11, color: "#445", letterSpacing: 2, marginBottom: 8 }}>PROGRESS</div>
            <div style={{ background: "#111", borderRadius: 4, height: 6, overflow: "hidden" }}>
              <div style={{
                height: "100%",
                width: `${((activeStage * 4 + activeDay + 1) / 20) * 100}%`,
                background: stage.color,
                transition: "width 0.4s",
                borderRadius: 4,
              }} />
            </div>
            <div style={{ fontSize: 10, color: "#445", marginTop: 6 }}>
              Day {activeStage * 4 + activeDay + 1} of 20
            </div>
          </div>
        </div>

        {/* Center - Day Selector */}
        <div style={{
          width: 160,
          borderRight: "1px solid #1e1e2e",
          padding: "20px 0",
          background: "#09090f",
        }}>
          <div style={{ fontSize: 12, color: "#445", letterSpacing: 2, padding: "0 16px 12px" }}>
            DAYS
          </div>
          {stage.days.map((d, i) => (
            <button
              key={i}
              onClick={() => { setActiveDay(i); setTab("topics"); }}
              style={{
                width: "100%",
                background: activeDay === i ? "#111827" : "transparent",
                border: "none",
                borderLeft: activeDay === i ? `3px solid ${stage.color}` : "3px solid transparent",
                color: activeDay === i ? "#e8e8f0" : "#445",
                padding: "10px 16px",
                textAlign: "left",
                cursor: "pointer",
                transition: "all 0.15s",
                fontSize: 13,
              }}
            >
              <div style={{ fontWeight: 700, color: activeDay === i ? stage.color : "#334" }}>{d.day}</div>
              <div style={{ fontSize: 11, marginTop: 2, lineHeight: 1.3 }}>{d.title}</div>
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, padding: "28px 32px", overflowY: "auto" }}>
          {/* Day Header */}
          <div style={{
            marginBottom: 24,
            paddingBottom: 20,
            borderBottom: `1px solid ${stage.color}33`,
          }}>
            <div style={{ fontSize: 12, color: stage.color, letterSpacing: 3, marginBottom: 6 }}>
              {stage.stage} · {stage.duration}
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#f0f0ff", marginBottom: 4 }}>
              {day.day}: {day.title}
            </div>
            <div style={{ fontSize: 12, color: "#445" }}>{stage.title}</div>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
            {["topics", "project", "commands"].map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  background: tab === t ? stage.color : "transparent",
                  color: tab === t ? "#000" : "#556",
                  border: `1px solid ${tab === t ? stage.color : "#1e1e2e"}`,
                  borderRadius: 4,
                  padding: "5px 14px",
                  fontSize: 10,
                  letterSpacing: 1.5,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontWeight: tab === t ? 700 : 400,
                  textTransform: "uppercase",
                  transition: "all 0.15s",
                }}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Topics Tab */}
          {tab === "topics" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {day.topics.map((topic, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    padding: "12px 16px",
                    background: "#0d0d18",
                    border: "1px solid #1e1e2e",
                    borderRadius: 6,
                  }}
                >
                  <span style={{
                    color: stage.color,
                    fontSize: 12,
                    fontWeight: 700,
                    minWidth: 20,
                    marginTop: 1,
                  }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span style={{ fontSize: 16, fontWeight: 500, lineHeight: 1.6, color: "#c8c8e0" }}>{topic}</span>
                </div>
              ))}
            </div>
          )}

          {/* Project Tab */}
          {tab === "project" && (
            <div style={{
              background: `${stage.color}08`,
              border: `1px solid ${stage.color}44`,
              borderRadius: 8,
              padding: 24,
            }}>
              <div style={{ fontSize: 13, color: stage.color, letterSpacing: 2, marginBottom: 12 }}>
                🚀 HANDS-ON PROJECT
              </div>
              <div style={{ fontSize: 17, lineHeight: 1.8, color: "#d0d0e8" }}>
                {day.project}
              </div>
              <div style={{
                marginTop: 20,
                padding: "12px 16px",
                background: "#0a0a14",
                borderRadius: 6,
                fontSize: 13,
                color: "#556",
              }}>
                💡 Tip: Always commit your Dockerfile and docker-compose.yml to version control. Document what each instruction does.
              </div>
            </div>
          )}

          {/* Commands Tab */}
          {tab === "commands" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ fontSize: 13, color: stage.color, letterSpacing: 2, marginBottom: 12 }}>
                KEY COMMANDS FOR THIS DAY
              </div>
              {day.commands.map((cmd, i) => (
                <div
                  key={i}
                  style={{
                    padding: "10px 16px",
                    background: "#0d0d18",
                    border: "1px solid #1a1a2e",
                    borderRadius: 6,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <span style={{ color: stage.color, fontSize: 13 }}>$</span>
                  <code style={{ fontSize: 14, color: "#a8d8f0", letterSpacing: 0.5 }}>{cmd}</code>
                </div>
              ))}
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 32 }}>
            <button
              onClick={() => {
                if (activeDay > 0) setActiveDay(activeDay - 1);
                else if (activeStage > 0) { setActiveStage(activeStage - 1); setActiveDay(roadmap[activeStage - 1].days.length - 1); }
                setTab("topics");
              }}
              style={{
                background: "transparent",
                border: "1px solid #1e1e2e",
                color: "#445",
                padding: "8px 18px",
                borderRadius: 4,
                cursor: "pointer",
                fontSize: 11,
                fontFamily: "inherit",
              }}
            >
              ← PREV
            </button>
            <button
              onClick={() => {
                if (activeDay < stage.days.length - 1) setActiveDay(activeDay + 1);
                else if (activeStage < roadmap.length - 1) { setActiveStage(activeStage + 1); setActiveDay(0); }
                setTab("topics");
              }}
              style={{
                background: stage.color,
                border: "none",
                color: "#000",
                padding: "8px 18px",
                borderRadius: 4,
                cursor: "pointer",
                fontSize: 11,
                fontFamily: "inherit",
                fontWeight: 700,
              }}
            >
              NEXT →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

