def generate_learning_path(graph, skills):

    visited = set()
    path = []

    def dfs(node):
        if node in visited:
            return

        visited.add(node)

        for parent in graph.predecessors(node):
            dfs(parent)

        path.append(node)

    for skill in skills:
        dfs(skill)

    return path