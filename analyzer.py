import ast
import json

with open("student_code.py", "r", encoding="utf-8") as file:
    code = file.read()

tree = ast.parse(code)

variables = {}
steps = []


def save_step(changed_variable, value):
    steps.append({
        "variable": changed_variable,
        "value": value,
        "all_variables": variables.copy()
    })


def evaluate_expression(expr):
    if isinstance(expr, ast.Constant):
        return expr.value


    elif isinstance(expr, ast.Name):

        if expr.id not in variables:
            error_step = {

                "variable": expr.id,

                "value": None,

                "all_variables": variables.copy(),

                "error": {

                    "type": "undefined_variable",

                    "variable": expr.id,

                    "message": f"המשתנה {expr.id} לא הוגדר לפני השימוש בו",

                    "hint": f"כדי לפתור את הבעיה, יש להגדיר את {expr.id} לפני שמשתמשים בו."

                }

            }

            steps.append(error_step)

            raise NameError(f"Undefined variable: {expr.id}")

        return variables[expr.id]

    elif isinstance(expr, ast.BinOp):
        left = evaluate_expression(expr.left)
        right = evaluate_expression(expr.right)

        if isinstance(expr.op, ast.Add):
            return left + right
        elif isinstance(expr.op, ast.Sub):
            return left - right
        elif isinstance(expr.op, ast.Mult):
            return left * right
        elif isinstance(expr.op, ast.Div):
            return left / right

    return "Unsupported expression"


def handle_assignment(node):
    variable_name = node.targets[0].id
    value = evaluate_expression(node.value)

    variables[variable_name] = value
    save_step(variable_name, value)


def handle_for_loop(node):
    loop_variable = node.target.id

    # Supports: for i in range(5)
    if isinstance(node.iter, ast.Call) and node.iter.func.id == "range":
        end_value = evaluate_expression(node.iter.args[0])

        for i in range(end_value):
            variables[loop_variable] = i
            save_step(loop_variable, i)

            for inner_node in node.body:
                if isinstance(inner_node, ast.Assign):
                    handle_assignment(inner_node)


try:
    for node in tree.body:
        if isinstance(node, ast.Assign):
            handle_assignment(node)

        elif isinstance(node, ast.For):
            handle_for_loop(node)

except NameError:
    pass

with open("steps.json", "w", encoding="utf-8") as json_file:
    json.dump(steps, json_file, indent=4, ensure_ascii=False)

print("steps.json created successfully")