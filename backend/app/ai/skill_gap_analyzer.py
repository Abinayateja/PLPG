from .knowledge_graph import KnowledgeGraph

def analyze_skill_gap(user_skills, goal_skill, graph):

    required = list(graph.predecessors(goal_skill))

    gap = []

    for skill in required:
        if skill not in user_skills:
            gap.append(skill)

    return gap