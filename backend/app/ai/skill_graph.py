from .knowledge_graph import KnowledgeGraph

kg = KnowledgeGraph()

kg.add_edge("python","numpy")
kg.add_edge("numpy","pandas")
kg.add_edge("pandas","data_analysis")

kg.add_edge("python","statistics")
kg.add_edge("statistics","machine_learning")
kg.add_edge("machine_learning","deep_learning")

kg.add_edge("html","css")
kg.add_edge("css","javascript")
kg.add_edge("javascript","react")

skill_graph = kg.get_graph()