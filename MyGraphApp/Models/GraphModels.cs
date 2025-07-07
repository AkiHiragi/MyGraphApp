namespace MyGraphApp.Models;

public class GraphRequest
{
    public string Function { get; set; } = string.Empty;
    public double MinX     { get; set; } = -10;
    public double MaxX     { get; set; } = 10;
    public int    Points   { get; set; } = 100;
}

public class GraphPoint(double x, double y)
{
    public double X { get; set; } = x;
    public double Y { get; set; } = y;
}

public class GraphResponse
{
    public List<GraphPoint> Points  { get; set; } = [];
    public bool             Success { get; set; }
    public string?          Error   { get; set; }
}