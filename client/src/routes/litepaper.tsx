import { Header } from "@/components/header/header";

export default function Litepaper() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <article className="prose prose-invert prose-lg">
          <h1 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white to-secondary drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            Synp: A Decentralized AI Infrastructure for Creating and Connecting
            AI Agents
          </h1>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-secondary">
              Introduction
            </h2>
            <p className="text-gray-300">
              Synp is an innovative platform that redefines how AI agents are
              created, managed, and connected. Inspired by the concept of
              synapses in the human brain, Synp enables users to design their
              own AI agents through simple prompts, supervise these agents via a
              centralized dashboard, and eventually connect them to form
              collaborative agent networks. With future blockchain integration,
              Synp aims to build a decentralized infrastructure for
              transparency, traceability, and AI agent autonomy.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-secondary">
              Current Challenges
            </h2>
            <ul className="space-y-4">
              {[
                "Complexity in Creating AI Agents: Developing sophisticated AI agents requires significant technical expertise.",
                "AI Agent Silos: Current AI agents often operate in isolation, limiting their collaborative potential.",
                "Lack of Transparency: Agent interactions are not always auditable or traceable.",
              ].map((challenge, i) => (
                <li key={i} className="flex items-start text-gray-300">
                  <span className="inline-block w-2 h-2 mt-2 mr-2 bg-[#00D2BE] rounded-full"></span>
                  <span>{challenge}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-secondary">
              Mission of Synp
            </h2>
            <p className="text-gray-300">
              To provide a simple, powerful, and decentralized platform that
              enables users to create, manage, and connect their AI agents for
              complex and collaborative workflows.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-secondary">
              Key Features
            </h2>
            <ul className="space-y-4">
              {[
                "Integration with Eliza: Synp leverages the Eliza framework to build, deploy, and manage AI agents efficiently. Eliza provides powerful tools for multi-agent systems, enabling agents to maintain unique personalities, interact across multiple platforms, and operate autonomously with advanced memory capabilities. By integrating Eliza, Synp ensures a robust and flexible backend for managing sophisticated AI workflows.",
                "Agent Creation via Prompt: An intuitive interface allowing users to describe the skills, personalities, and roles of their AI agents.",
                "Agent Dashboard: Supervise all created agents. Activity logs and configuration modification capabilities.",
                "Agent-to-Agent Connection: User-defined workflows enabling multiple agents to collaborate.",
                {
                  title: "Blockchain Integration (Upcoming):",
                  subitems: [
                    "Decentralized Identity: Assigning a unique and verifiable identity to each agent.",
                    "Traceability: Recording interactions on a public or private blockchain.",
                  ],
                },
              ].map((feature, i) => (
                <li key={i} className="flex items-start">
                  {typeof feature === "string" ? (
                    <>
                      <span className="inline-block w-2 h-2 mt-2 mr-2 bg-[#00D2BE] rounded-full"></span>
                      <span>{feature}</span>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-start">
                        <span className="inline-block w-2 h-2 mt-2 mr-2 bg-[#00D2BE] rounded-full"></span>
                        <span>{feature.title}</span>
                      </div>
                      <ul className="ml-6 space-y-2">
                        {feature.subitems.map((subitem, j) => (
                          <li key={j} className="flex items-start">
                            <span className="inline-block w-1.5 h-1.5 mt-2 mr-2 bg-secondary rounded-full"></span>
                            <span>{subitem}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-secondary">
              Hyperliquid and HyperEVM
            </h2>
            <p className="text-gray-300">
              Synp will leverage HyperEVM, an innovative L1 developed by
              Hyperliquid. This blockchain infrastructure offers high
              performance and reduced transaction fees, making it ideal for
              managing agent identities and on-chain interactions. By using
              HyperEVM, Synp ensures optimal scalability and compatibility with
              industry standards while paving the way for widespread adoption of
              decentralized AI agents.
            </p>
            <p className="text-gray-300 mt-4">
              Hypurr.fun and the SYNP Token Synp will launch its native token,
              SYNP, on Hypurr.fun, a next-generation decentralized platform
              designed for token launches and community engagement. The SYNP
              token will play a pivotal role in the Synp ecosystem, enabling
              governance, incentivizing participation, and facilitating
              transactions within the platform. Additionally, 5% of the total
              supply of SYNP will be reserved to ensure the sustainability of
              the project and to cover potential operational costs. By
              leveraging Hypurr.fun, Synp ensures a fair and accessible launch
              for its token, aligning with its decentralized ethos.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-secondary">
              Use Cases
            </h2>
            <ul className="space-y-4">
              {[
                "Personalized Assistants: Creating agents to handle personal or professional tasks.",
                "Crypto Data Analysis: Agents monitoring market trends, analyzing on-chain data, or interacting with smart contracts.",
                "Community Moderation: Autonomous bots moderating platforms like Discord or Telegram.",
                "Multi-Agent Coordination: Networks of agents collaborating for complex workflows, such as data collection, analysis, and decision-making.",
              ].map((useCase, i) => (
                <li key={i} className="flex items-start">
                  <span className="inline-block w-2 h-2 mt-2 mr-2 bg-[#00D2BE] rounded-full"></span>
                  <span>{useCase}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-secondary">
              Competitive Advantages
            </h2>
            <ul className="space-y-4">
              {[
                "Ease of Use: A clear interface for creating agents without coding.",
                "Agent Collaboration: A unique ecosystem fostering synergy between AI agents.",
                "Transparency and Security: Blockchain provides total verification and auditability.",
                "Hyperliquid: Integration with HyperEVM enhances the speed and security of on-chain operations.",
                "Eliza Framework: Built on a proven foundation for multi-agent systems, ensuring scalability and extensibility.",
                "Token Integration: The SYNP token facilitates governance and incentivization within the ecosystem.",
              ].map((advantage, i) => (
                <li key={i} className="flex items-start">
                  <span className="inline-block w-2 h-2 mt-2 mr-2 bg-[#00D2BE] rounded-full"></span>
                  <span>{advantage}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-secondary">
              Long-Term Vision
            </h2>
            <p className="text-gray-300">
              Synp aspires to become the global standard for creating and
              managing connected AI agents, combining artificial intelligence
              and blockchain technology to develop a decentralized AI agent
              network.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-secondary">
              Conclusion
            </h2>
            <p className="text-gray-300">
              Synp represents a new era of collaboration between artificial
              intelligence and decentralized technologies. With an intuitive
              interface, innovative features, and a vision centered on
              transparency and connectivity, Synp paves the way for a future
              where AI agents work together to address complex needs within a
              secure and decentralized ecosystem.
            </p>
          </section>
        </article>
      </main>
    </div>
  );
}
