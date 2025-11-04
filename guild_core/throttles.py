from rest_framework.throttling import SimpleRateThrottle


class ApplicationRateThrottle(SimpleRateThrottle):
    """Limit number of application submissions per IP to prevent spam.

    Default: 10 per hour (configurable via settings REST_FRAMEWORK DEFAULT_THROTTLE_RATES)
    """
    scope = 'application'
