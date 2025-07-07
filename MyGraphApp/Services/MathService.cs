using DynamicExpresso;
using MyGraphApp.Models;

namespace MyGraphApp.Services;

public class MathService
{
    private readonly Interpreter _interpreter;

    public MathService()
    {
        _interpreter = new Interpreter();

        _interpreter.SetFunction("sin",  (Func<double, double>)Math.Sin);
        _interpreter.SetFunction("cos",  (Func<double, double>)Math.Cos);
        _interpreter.SetFunction("tan",  (Func<double, double>)Math.Tan);
        _interpreter.SetFunction("sqrt", (Func<double, double>)Math.Sqrt);
        _interpreter.SetFunction("log",  (Func<double, double>)Math.Log);
        _interpreter.SetFunction("exp",  (Func<double, double>)Math.Exp);
        _interpreter.SetFunction("abs",  (Func<double, double>)Math.Abs);
        _interpreter.SetFunction("pow",  (Func<double, double, double>)Math.Pow);

        _interpreter.SetVariable("pi", Math.PI);
        _interpreter.SetVariable("e",  Math.E);
    }

    public GraphResponse CalculateGraph(GraphRequest request)
    {
        var response  = new GraphResponse();

        try
        {
            var points = new List<GraphPoint>();
            var step   = (request.MaxX - request.MinX) / request.Points;

            for (var i = 0; i <= request.Points; i++)
            {
                var x = request.MinX + i * step;
                var y = EvaluateFunction(request.Function, x);

                if (!double.IsNaN(y) && !double.IsInfinity(y))
                    points.Add(new GraphPoint(x, y));
            }

            response.Points  = points;
            response.Success = true;
        }
        catch (Exception ex)
        {
            response.Success = false;
            response.Error   = ex.Message;
        }

        return response;
    }

    private double EvaluateFunction(string function, double x)
    {
        try
        {
            var expression = function.Replace("^", ", ").Replace("x, ", "pow(x, ") + ")";
            
            if (!function.Contains('^'))
            {
                expression = function;
            }
        
            _interpreter.SetVariable("x", x);
            var result = _interpreter.Eval(expression);
            return Convert.ToDouble(result);
        }
        catch (Exception ex)
        {
            return double.NaN;
        }
    }
}