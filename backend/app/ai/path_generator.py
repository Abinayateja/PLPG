def dfs(graph,node,visited,path):

    if node in visited:
        return

    visited.add(node)

    for child in graph.successors(node):
        dfs(graph,child,visited,path)

    path.append(node)


def generate_learning_path(graph,skills):

    visited=set()

    path=[]

    for skill in skills:
        dfs(graph,skill,visited,path)

    return path[::-1]