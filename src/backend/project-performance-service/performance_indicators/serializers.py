from rest_framework import serializers
from performance_indicators.models import PerformanceIndicator, PerformanceIndicatorComponent


class PerformanceIndicatorSerializer(serializers.ModelSerializer):
    class Meta:
        model = PerformanceIndicator
        fields = ['id', 'project', 'creator', 'indicator_name', 'indicator_due_date',
                  'assignees']
        read_only_fields = ['id']
        depth = 2


class PerformanceIndicatorComponentSerializer(serializers.ModelSerializer):
    class Meta:
        model = PerformanceIndicatorComponent
        fields = ['id', 'project', 'name', 'performance_indicator', 'component_value', 'component_due_date',
                  'assignees']
        read_only_fields = ['id']
        depth = 1

