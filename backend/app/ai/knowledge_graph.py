import networkx as nx


class KnowledgeGraph:

    def __init__(self):
        self.graph = nx.DiGraph()

    # -------------------------
    # ADD SKILL NODE
    # -------------------------
    def add_skill(self, skill, level="beginner", domain="general"):
        self.graph.add_node(skill, level=level, domain=domain)

    # -------------------------
    # ADD RELATIONSHIP
    # -------------------------
    def add_edge(self, prerequisite, skill):
        self.graph.add_edge(prerequisite, skill)

    # -------------------------
    # GET ALL PREREQUISITES (FULL DEPTH)
    # -------------------------
    def get_prerequisites(self, skill):
        return list(nx.ancestors(self.graph, skill))

    # -------------------------
    # GET NEXT SKILLS (FORWARD)
    # -------------------------
    def get_next_skills(self, skill):
        return list(self.graph.successors(skill))

    # -------------------------
    # GET SKILL LEVEL
    # -------------------------
    def get_skill_level(self, skill):
        return self.graph.nodes[skill].get("level", "beginner")

    # -------------------------
    # FILTER BY LEVEL
    # -------------------------
    def filter_by_level(self, skills, target_level):

        level_order = {
            "beginner": 1,
            "intermediate": 2,
            "advanced": 3
        }

        return [
            s for s in skills
            if level_order[self.get_skill_level(s)] <= level_order[target_level]
        ]

    # -------------------------
    # TOPOLOGICAL SORT (SMART PATH)
    # -------------------------
    def get_learning_path(self, skills):
        subgraph = self.graph.subgraph(skills)
        return list(nx.topological_sort(subgraph))

    # -------------------------
    # GET GRAPH
    # -------------------------
    def get_graph(self):
        return self.graph