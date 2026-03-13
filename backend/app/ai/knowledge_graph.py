import networkx as nx

class KnowledgeGraph:

    def __init__(self):

        self.graph = nx.DiGraph()

    def add_edge(self, prerequisite, skill):

        self.graph.add_edge(prerequisite, skill)

    def prerequisites(self, skill):

        return list(nx.ancestors(self.graph, skill))

    def get_graph(self):

        return self.graph