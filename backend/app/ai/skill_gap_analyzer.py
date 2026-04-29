def get_all_prerequisites(graph, skill):

    visited = set()
    stack = [skill]

    g = graph.get_graph()   # ✅ extract internal graph

    while stack:
        node = stack.pop()

        for parent in g.predecessors(node):
            if parent not in visited:
                visited.add(parent)
                stack.append(parent)

    return visited


def analyze_skill_gap(user_skills, goal_skill, graph):

    all_required = graph.get_prerequisites(goal_skill)

    gap = [s for s in all_required if s not in user_skills]

    return gap

