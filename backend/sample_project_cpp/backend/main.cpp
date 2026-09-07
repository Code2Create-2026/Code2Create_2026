#include "crow.h"

int main()
{
    crow::SimpleApp app;

    CROW_ROUTE(app, "/api/user")
    ([]{
        crow::json::wvalue x;
        x["userId"] = 101;
        x["name"] = "Mithul";
        x["email"] = "mithul@example.com";
        return x;
    });

    CROW_ROUTE(app, "/api/health")
    ([]{
        crow::json::wvalue x;
        x["status"] = "ok";
        return x;
    });

    app.port(18080).multithreaded().run();
}
