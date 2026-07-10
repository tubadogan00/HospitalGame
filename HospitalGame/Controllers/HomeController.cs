using Microsoft.AspNetCore.Mvc;

namespace HospitalGame.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Oyun()
        {
            return View();
        }
    }
}