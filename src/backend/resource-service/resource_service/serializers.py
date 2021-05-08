import logging

from rest_framework import serializers
from rest_framework_guardian.serializers import ObjectPermissionsAssignmentMixin

logger = logging.getLogger('default')


class LoggingSerializer(ObjectPermissionsAssignmentMixin, serializers.ModelSerializer):

    def is_valid(self, raise_exception=False):
        logger.debug("Processing TaskSerializer {0!r}".format(self.__repr__()))
        is_valid = super().is_valid()
        if is_valid:
            logger.debug("Successfully processed {0!r} {1!r}".format(self.__class__.__name__, self.__repr__()))
        else:
            logger.info("Unsuccessfully processed {0!r} {1!r}".format(self.__class__.__name__, self.__repr__()))
        return is_valid

    #TODO write create and update methods loggers
