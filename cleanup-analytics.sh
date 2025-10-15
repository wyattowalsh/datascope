#!/bin/bash
# Cleanup script to remove duplicate analytics files
# Run this from the project root: bash cleanup-analytics.sh

echo "🧹 Cleaning up duplicate analytics files..."

# Files to remove (duplicates that now live in /src/components/analytics/)
FILES_TO_REMOVE=(
  "src/components/EnhancedAnalytics.tsx"
  "src/components/StatsPanel.tsx"
  "src/components/InsightsPanel.tsx"
  "src/components/PerformanceAnalysis.tsx"
  "src/components/GraphAnalyticsPanel.tsx"
)

for file in "${FILES_TO_REMOVE[@]}"; do
  if [ -f "$file" ]; then
    echo "  ❌ Removing: $file"
    rm "$file"
  else
    echo "  ⏭️  Already removed: $file"
  fi
done

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "All analytics components are now consolidated in:"
echo "  📁 src/components/analytics/"
echo ""
echo "Components available:"
echo "  - StatsPanel"
echo "  - InsightsPanel"
echo "  - PerformanceAnalysis"
echo "  - GraphAnalyticsPanel"
echo "  - ComplexityAnalysis (NEW)"
echo "  - QualityAnalysis (NEW)"
echo "  - DensityAnalysis (NEW)"
