from .knowledge_graph import KnowledgeGraph

kg = KnowledgeGraph()

# ADD NODES
kg.add_skill("python", "beginner")
kg.add_skill("numpy", "intermediate")
kg.add_skill("pandas", "intermediate")
kg.add_skill("data_analysis", "intermediate")

kg.add_skill("statistics", "beginner")
kg.add_skill("machine_learning", "intermediate")
kg.add_skill("deep_learning", "advanced")

# ADD EDGES
kg.add_edge("python", "numpy")
kg.add_edge("numpy", "pandas")
kg.add_edge("pandas", "data_analysis")

kg.add_edge("python", "statistics")
kg.add_edge("statistics", "machine_learning")
kg.add_edge("machine_learning", "deep_learning")

skill_graph = kg

