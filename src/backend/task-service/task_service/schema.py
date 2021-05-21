from drf_spectacular.extensions import OpenApiAuthenticationExtension


class MicroservicesAuthenticationExtension(OpenApiAuthenticationExtension):
    target_class = 'task_service.microservices_auth.MicroservicesJWTBackend'
    name = 'Microservices auth'

    def get_security_definition(self, auto_schema):
        return {
            'type': 'apiKey',
            'in': 'header',
            'name': 'Authorization',
            }
