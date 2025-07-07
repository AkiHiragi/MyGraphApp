using Microsoft.AspNetCore.Mvc;
using MyGraphApp.Models;
using MyGraphApp.Services;

namespace MyGraphApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GraphController : ControllerBase
{
    private readonly MathService _mathService;

    public GraphController(MathService mathService)
    {
        _mathService = mathService;
    }

    [HttpPost("calculate")]
    public ActionResult<GraphResponse> CalculateGraph([FromBody] GraphRequest request)
    {
        if (string.IsNullOrEmpty(request.Function))
            return BadRequest("Function is required");
        
        var result = _mathService.CalculateGraph(request);

        if (!result.Success)
            return BadRequest(result.Error);
        
        return Ok(result);
    }
}