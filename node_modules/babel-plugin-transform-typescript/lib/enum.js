"use strict";

exports.__esModule = true;
exports.default = transpileEnum;

function transpileEnum(path, t) {
  var node = path.node;

  if (node.declare) {
    path.remove();
    return;
  }

  if (node.const) {
    throw path.buildCodeFrameError("'const' enums are not supported.");
  }

  var name = node.id.name;
  var fill = enumFill(path, t, node.id);

  switch (path.parent.type) {
    case "BlockStatement":
    case "Program":
      {
        var isGlobal = t.isProgram(path.parent);

        if (seen(path.parentPath)) {
          path.replaceWith(fill);
        } else {
          path.replaceWithMultiple([makeVar(node.id, t, isGlobal ? "var" : "let"), fill]);
        }

        break;
      }

    case "ExportNamedDeclaration":
      {
        path.parentPath.insertAfter(fill);

        if (seen(path.parentPath.parentPath)) {
          path.remove();
        } else {
          path.replaceWith(makeVar(node.id, t, "let"));
        }

        break;
      }

    default:
      throw new Error("Unexpected enum parent '" + path.parent.type);
  }

  function seen(parentPath) {
    if (parentPath.getData(name)) {
      return true;
    } else {
      parentPath.setData(name, true);
      return false;
    }
  }
}

function makeVar(id, t, kind) {
  return t.variableDeclaration(kind, [t.variableDeclarator(id)]);
}

function enumFill(path, t, id) {
  var x = translateEnumValues(path, t);
  var assignments = x.map(function (_ref) {
    var memberName = _ref[0],
        memberValue = _ref[1];
    var inner = t.assignmentExpression("=", t.memberExpression(id, t.stringLiteral(memberName), true), memberValue);
    var outer = t.assignmentExpression("=", t.memberExpression(id, inner, true), t.stringLiteral(memberName));
    return t.expressionStatement(outer);
  });
  var callArg = t.logicalExpression("||", id, t.assignmentExpression("=", id, t.objectExpression([])));
  var body = t.blockStatement(assignments);
  var callee = t.functionExpression(null, [id], body);
  return t.expressionStatement(t.callExpression(callee, [callArg]));
}

function translateEnumValues(path, t) {
  var seen = Object.create(null);
  var prev = -1;
  return path.node.members.map(function (member) {
    var name = t.isIdentifier(member.id) ? member.id.name : member.id.value;
    var initializer = member.initializer;
    var value = void 0;

    if (initializer) {
      var constValue = evaluate(initializer, seen);

      if (constValue !== undefined) {
        value = t.numericLiteral(constValue);
        prev = constValue;
      } else {
        value = initializer;
        prev = undefined;
      }
    } else {
      if (prev !== undefined) {
        prev++;
        value = t.numericLiteral(prev);
      } else {
        throw path.buildCodeFrameError("Enum member must have initializer.");
      }
    }

    return [name, value];
  });
}

function evaluate(expr, seen) {
  return evalConstant(expr);

  function evalConstant(expr) {
    switch (expr.type) {
      case "UnaryExpression":
        return evalUnaryExpression(expr);

      case "BinaryExpression":
        return evalBinaryExpression(expr);

      case "NumericLiteral":
        return expr.value;

      case "ParenthesizedExpression":
        return evalConstant(expr.expression);

      case "Identifier":
        return seen[expr.name];

      default:
        return undefined;
    }
  }

  function evalUnaryExpression(_ref2) {
    var argument = _ref2.argument,
        operator = _ref2.operator;
    var value = evalConstant(argument);

    if (value === undefined) {
      return undefined;
    }

    switch (operator) {
      case "+":
        return value;

      case "-":
        return -value;

      case "~":
        return ~value;

      default:
        return undefined;
    }
  }

  function evalBinaryExpression(expr) {
    var left = evalConstant(expr.left);

    if (left === undefined) {
      return undefined;
    }

    var right = evalConstant(expr.right);

    if (right === undefined) {
      return undefined;
    }

    switch (expr.operator) {
      case "|":
        return left | right;

      case "&":
        return left & right;

      case ">>":
        return left >> right;

      case ">>>":
        return left >>> right;

      case "<<":
        return left << right;

      case "^":
        return left ^ right;

      case "*":
        return left * right;

      case "/":
        return left / right;

      case "+":
        return left + right;

      case "-":
        return left - right;

      case "%":
        return left % right;

      default:
        return undefined;
    }
  }
}