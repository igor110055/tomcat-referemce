/*
 *+------------------------------------------------------------------------+
 *| Licensed Materials - Property of IBM
 *| IBM Cognos Products: Viewer
 *| (C) Copyright IBM Corp. 2001, 2011
 *|
 *| US Government Users Restricted Rights - Use, duplication or
 *| disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *|
 *+------------------------------------------------------------------------+
 */

dojo.provide( "bux.reportViewer.chart");

dojo.declare( "bux.reportViewer.chart", null,
{
	m_displayTypeDialogDefinition: null,

	constructor: function( )
	{
		this.initialize();
	},

	initialize: function()
	{
		if( this.m_displayTypeDialogDefinition !== null)
		{
			return;
		}
			this.m_displayTypeDialogDefinition = [
								{
									//label: "Table",
									label: RV_RES.IDS_JS_CHART_TABLE,
									image: "images/dialog/displayOptionsDialog/type_icons/table.gif",
									options: [
												{
													label: RV_RES.IDS_JS_CHART_CROSSTAB,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/crosstab_48.gif",
													value: "crosstab"
												},
												{
													label: RV_RES.IDS_JS_CHART_LIST_TABLE,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/List_48.gif",
													value: "list"
												}
											]
								},
								{
									label: RV_RES.IDS_JS_CHART_COLUMN,
									image: "images/dialog/displayOptionsDialog/type_icons/column.gif",
									options: [
												{
													label: RV_RES.IDS_JS_CHART_COLUMN,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_column_clustered_flat.gif",
													value: "column_clustered_flat"
												},
												{
													//label: "Column with 3-D Visual Effect",
													label: RV_RES.IDS_JS_CHART_COLUMN_3D,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_column_clustered.gif",
													value: "column_clustered"
												},
												{
													//label: "Stacked Column",
													label: RV_RES.IDS_JS_CHART_STACKED_COLUMN,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_column_stacked_flat.gif",
													value: "column_stacked_flat"
												},
												{
													//label: "Stacked Column with 3-D Visual Effect",
													label: RV_RES.IDS_JS_CHART_STACKED_COLUMN_3D,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_column_stacked.gif",
													value: "column_stacked"
												},
												{
													//label: "100% Stacked Column",
													label: RV_RES.IDS_JS_CHART_PERCENT_STACKED_COLUMN,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_column_percent_flat.gif",
													value: "column_percent_flat"
												},
												{
													//label: "100% Stacked Column with 3-D Visual Effect",
													label: RV_RES.IDS_JS_CHART_PERCENT_STACKED_COLUMN_3D,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_column_percent.gif",
													value: "column_percent"
												},
												{
													//label: "3-D Axis Column",
													label: RV_RES.IDS_JS_CHART_3D_AXIS_COLUMN,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_column_3daxis.gif",
													value: "column_3daxis"
												},
												{
													label: RV_RES.IDS_JS_CHART_COLUMN,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_column_rectangle_clustered.jpg",
													value: "v2_column_rectangle_clustered"
												},
												{
													//label: "Column with 3-D Visual Effect",
													label: RV_RES.IDS_JS_CHART_COLUMN_3D,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_column_box_clustered_depth.jpg",
													value: "v2_column_box_clustered_depth"
												},
												{
													//label: "Stacked Column",
													label: RV_RES.IDS_JS_CHART_STACKED_COLUMN,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_column_rectangle_stacked.jpg",
													value: "v2_column_rectangle_stacked"
												},
												{
													//label: "Stacked Column with 3-D Visual Effect",
													label: RV_RES.IDS_JS_CHART_STACKED_COLUMN_3D,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_column_box_stacked_depth.jpg",
													value: "v2_column_box_stacked_depth"
												},
												{
													//label: "100% Stacked Column",
													label: RV_RES.IDS_JS_CHART_PERCENT_STACKED_COLUMN,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_column_rectangle_percent.jpg",
													value: "v2_column_rectangle_percent"
												},
												{
													//label: "100% Stacked Column with 3-D Visual Effect",
													label: RV_RES.IDS_JS_CHART_PERCENT_STACKED_COLUMN_3D,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_column_box_percent_depth.jpg",
													value: "v2_column_box_percent_depth"
												}
											]
								},
								{
									//label: "Bar",
									label: RV_RES.IDS_JS_CHART_BAR,
									image: "images/dialog/displayOptionsDialog/type_icons/bar.gif",
									options: [
												{
													label: RV_RES.IDS_JS_CHART_BAR,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_bar_clustered_flat.gif",
													value: "bar_clustered_flat"
												},
												{
													//label: "Bar with 3-D Visual Effect",
													label: RV_RES.IDS_JS_CHART_BAR_3D,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_bar_clustered.gif",
													value: "bar_clustered"
												},
												{
													//label: "Stacked Bar",
													label: RV_RES.IDS_JS_CHART_STACKED_BAR,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_bar_stacked_flat.gif",
													value: "bar_stacked_flat"
												},
												{
													//label: "Stacked Bar with 3-D Visual Effect",
													label: RV_RES.IDS_JS_CHART_STACKED_BAR_3D,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_bar_stacked.gif",
													value: "bar_stacked"
												},
												{
													//label: "100% Stacked Bar",
													label: RV_RES.IDS_JS_CHART_PERCENT_STACKED_BAR,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_bar_percent_flat.gif",
													value: "bar_percent_flat"
												},
												{
													//label: "100% Stacked Bar with 3-D Visual Effect",
													label: RV_RES.IDS_JS_CHART_PERCENT_STACKED_BAR_3D,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_bar_percent.gif",
													value: "bar_percent"
												},
												{
													label: RV_RES.IDS_JS_CHART_BAR,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_bar_rectangle_clustered.jpg",
													value: "v2_bar_rectangle_clustered"
												},
												{
													//label: "Bar with 3-D Visual Effect",
													label: RV_RES.IDS_JS_CHART_BAR_3D,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_bar_box_clustered_depth.jpg",
													value: "v2_bar_box_clustered_depth"
												},
												{
													//label: "Stacked Bar",
													label: RV_RES.IDS_JS_CHART_STACKED_BAR,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_bar_rectangle_stacked.jpg",
													value: "v2_bar_rectangle_stacked"
												},
												{
													//label: "Stacked Bar with 3-D Visual Effect",
													label: RV_RES.IDS_JS_CHART_STACKED_BAR_3D,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_bar_box_stacked_depth.jpg",
													value: "v2_bar_box_stacked_depth"
												},
												{
													//label: "100% Stacked Bar",
													label: RV_RES.IDS_JS_CHART_PERCENT_STACKED_BAR,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_bar_rectangle_percent.jpg",
													value: "v2_bar_rectangle_percent"
												},
												{
													//label: "100% Stacked Bar with 3-D Visual Effect",
													label: RV_RES.IDS_JS_CHART_PERCENT_STACKED_BAR_3D,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_bar_box_percent_depth.jpg",
													value: "v2_bar_box_percent_depth"
												}
											]
								},
								{
									//label: "Line",
									label: RV_RES.IDS_JS_CHART_LINE,
									image: "images/dialog/displayOptionsDialog/type_icons/line.gif",
									options: [
												{
													//label: "Line with Markers",
													label: RV_RES.IDS_JS_CHART_LINE_WITH_MARKERS,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_line_clustered_flat_markers.gif",
													value: "line_clustered_flat_markers"
												},
												{
													//label: "Line",
													label: RV_RES.IDS_JS_CHART_LINE,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_line_clustered_flat.gif",
													value: "line_clustered_flat"
												},
												{
													//label: "Line with 3-D Visual Effect",
													label: RV_RES.IDS_JS_CHART_LINE_3D,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_line_clustered.gif",
													value: "line_clustered"
												},
												{
													//label: "Step Line with Markers",
													label: RV_RES.IDS_JS_CHART_STEP_LINE_MARKERS,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_line_stepAtPoint_clustered_flat_markers.gif",
													value: "line_stepAtPoint_clustered_flat_markers"
												},
												{
													//label: "Step Line",
													label: RV_RES.IDS_JS_CHART_STEP_LINE,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_line_stepAtPoint_clustered_flat.gif",
													value: "line_stepAtPoint_clustered_flat"
												},
												{
													//label: "Stacked Line with Markers",
													label: RV_RES.IDS_JS_CHART_STACKED_LINE_MARKERS,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_line_stacked_flat_markers.gif",
													value: "line_stacked_flat_markers"
												},
												{
													//label: "Stacked Line",
													label: RV_RES.IDS_JS_CHART_STACKED_LINE,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_line_stacked_flat.gif",
													value: "line_stacked_flat"
												},
												{
													//label: "Stacked Line with 3-D Visual Effect",
													label: RV_RES.IDS_JS_CHART_STACKED_LINE_3D,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_line_stacked.gif",
													value: "line_stacked"
												},
												{
													//label: "100% Stacked Line with Markers",
													label: RV_RES.IDS_JS_CHART_PERCENT_STACKED_LINE_MARKERS,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_line_percent_flat_markers.gif",
													value: "line_percent_flat_markers"
												},
												{
													//label: "100% Stacked Line",
													label: RV_RES.IDS_JS_CHART_PERCENT_STACKED_LINE,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_line_percent_flat.gif",
													value: "line_percent_flat"
												},
												{
													//label: "100% Stacked Line with 3-D Visual Effect",
													label: RV_RES.IDS_JS_CHART_PERCENT_STACKED_LINE__3D,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_line_percent.gif",
													value: "line_percent"
												},
												{
													//label: "3-D Axis Line",
													label: RV_RES.IDS_JS_CHART_3D_AXIS_LINE,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_line_3daxis.gif",
													value: "line_3daxis"
												},
												{
													//label: "Line",
													label: RV_RES.IDS_JS_CHART_LINE,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_line_clustered.jpg",
													value: "v2_line_clustered"
												},
												{
													//label: "Line with 3-D Visual Effect",
													label: RV_RES.IDS_JS_CHART_LINE_3D,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_line_clustered_depth.jpg",
													value: "v2_line_clustered_depth"
												},
												{
													//label: "Line with Markers",
													label: RV_RES.IDS_JS_CHART_LINE_WITH_MARKERS,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_line_clustered_markers.jpg",
													value: "v2_line_clustered_markers"
												},
												{
													//label: "Line with 3-D Visual Effect Markers",
													label: RV_RES.IDS_JS_CHART_LINE_WITH_3D_MARKERS,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_line_clustered_3dmarkers.jpg",
													value: "v2_line_clustered_3dmarkers"
												},
												{
													//label: "Step Line",
													label: RV_RES.IDS_JS_CHART_STEP_LINE,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_stepped_line_at_points_clustered.jpg",
													value: "v2_stepped_line_at_points_clustered"
												},
												{
													//label: "Step Line with 3-D Visual Effect",
													label: RV_RES.IDS_JS_CHART_STEP_LINE_3D,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_stepped_line_at_points_clustered_depth.jpg",
													value: "v2_stepped_line_at_points_clustered_depth"
												}
											]
								},
								{
									//label: "Pie, Donut",
									label: RV_RES.IDS_JS_CHART_PIE_DONUT,
									image: "images/dialog/displayOptionsDialog/type_icons/pie.gif",
									options: [
												{
													//label: "Pie",
													label: RV_RES.IDS_JS_CHART_PIE,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_pie_flat.gif",
													value: "pie_flat"
												},
												{
													//label: "Donut",
													label: RV_RES.IDS_JS_CHART_DONUT,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_pie_flat_hole.gif",
													value: "pie_flat_hole"
												},
												{
													//label: "Pie with 3-D Visual Effect",
													label: RV_RES.IDS_JS_CHART_PIE_3D,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_pie.gif",
													value: "pie"
												},
												{
													//label: "Donut with 3-D Visual Effect",
													label: RV_RES.IDS_JS_CHART_DONUT_3D,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_pie_hole.gif",
													value: "pie_hole"
												},
												{
													//label: "Pie",
													label: RV_RES.IDS_JS_CHART_PIE,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_pie_flat.jpg",
													value: "v2_pie"
												},
												{
													//label: "Pie with 3-D Visual Effect",
													label: RV_RES.IDS_JS_CHART_PIE_3D,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_pie.jpg",
													value: "v2_pie_depth_round"
												},
												{
													//label: "Donut",
													label: RV_RES.IDS_JS_CHART_DONUT,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_pie_hole_flat.jpg",
													value: "v2_donut"
												},
												{
													//label: "Donut with 3-D Visual Effect",
													label: RV_RES.IDS_JS_CHART_DONUT_3D,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_pie_hole.jpg",
													value: "v2_donut_depth_round"
												}
											]
								},
								{
									//label: "Area",
									label: RV_RES.IDS_JS_CHART_AREA,
									image: "images/dialog/displayOptionsDialog/type_icons/area.gif",
									options: [
												{
													//label: "Area",
													label: RV_RES.IDS_JS_CHART_AREA,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_area_clustered_flat.gif",
													value: "area_clustered_flat"
												},
												{
													//label: "Area with 3-D Visual Effect",
													label: RV_RES.IDS_JS_CHART_AREA_3D,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_area_clustered.gif",
													value: "area_clustered"
												},
												{
													//label: "Stacked Area",
													label: RV_RES.IDS_JS_CHART_STACKED_AREA,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_area_stacked_flat.gif",
													value: "area_stacked_flat"
												},
												{
													//label: "Stacked Area with 3-D Visual Effect",
													label: RV_RES.IDS_JS_CHART_STACKED_AREA_3D,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_area_stacked.gif",
													value: "area_stacked"
												},
												{
													//label: "100% Area",
													label: RV_RES.IDS_JS_CHART_PERCENT_AREA,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_area_percent_flat.gif",
													value: "area_percent_flat"
												},
												{
													//label: "100% Area with 3-D Visual Effect",
													label: RV_RES.IDS_JS_CHART_PERCENT_AREA_3D,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_area_percent.gif",
													value: "area_percent"
												},
												{
													//label: "3-D Axis Area",
													label: RV_RES.IDS_JS_CHART_3D_AXIS_AREA,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_area_3daxis.gif",
													value: "area_3daxis"
												},
												{
													//label: "Stacked Area",
													label: RV_RES.IDS_JS_CHART_STACKED_AREA,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_area_flat_point_to_point.gif",
													value: "v2_area_stacked_flat"
												},
												{
													//label: "Stacked Area with 3-D Visual Effect",
													label: RV_RES.IDS_JS_CHART_STACKED_AREA_3D,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_area_depth_point_to_point.gif",
													value: "v2_area_stacked"
												},
												{
													//label: "100% Area",
													label: RV_RES.IDS_JS_CHART_PERCENT_AREA,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_area_flat_percent_point_to_point.gif",
													value: "v2_area_percent_flat"
												},
												{
													//label: "100% Area with 3-D Visual Effect",
													label: RV_RES.IDS_JS_CHART_PERCENT_AREA_3D,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_area_depth_percent_point_to_point.gif",
													value: "v2_area_percent"
												}
											]
								},
								{
									//label: "Scatter, Bubble, Point",
									label: RV_RES.IDS_JS_CHART_SCATTER_BUBBLE_POINT,
									image: "images/dialog/displayOptionsDialog/type_icons/scatter.gif",
									options: [
												{
													//label: "Scatter",
													label: RV_RES.IDS_JS_CHART_SCATTER,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_scatter.gif",
													value: "scatter"
												},
												{
													//label: "Bubble",
													label: RV_RES.IDS_JS_CHART_BUBBLE,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_bubble.gif",
													value: "bubble"
												},
												{
													//label: "Bubble with Excel Bubble Sizing",
													label: RV_RES.IDS_JS_CHART_BUBBLE_WITH_EXCEL_BUBBLE_SIZING,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_bubble_excel.gif",
													value: "bubble_zeroBased"
												},
												{
													//label: "Point",
													label: RV_RES.IDS_JS_CHART_POINT,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_point_clustered.gif",
													value: "point_clustered"
												},
												{
													//label: "3-D Scatter",
													label: RV_RES.IDS_JS_CHART_3D_SCATTER,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_scatter_3daxis.gif",
													value: "scatter_3daxis"
												},
												{
													//label: "Scatter",
													label: RV_RES.IDS_JS_CHART_SCATTER,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_scatter.gif",
													value: "v2_scatter"
												},
												{
													//label: "Bubble",
													label: RV_RES.IDS_JS_CHART_BUBBLE,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_bubble.gif",
													value: "v2_bubble"
												},
												{
													//label: "Bubble with 3-D Visual Effect",
													label: RV_RES.IDS_JS_CHART_BUBBLE_3D,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_bubble_3dmarkers.gif",
													value: "v2_bubble_3d"
												},
												{
													//label: "Point",
													label: RV_RES.IDS_JS_CHART_POINT,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_point_clustered_markers.jpg",
													value: "v2_point_clustered_markers"
												},
												{
													//label: "Point with 3-D Markers",
													label: RV_RES.IDS_JS_CHART_POINT_3D,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_point_clustered_3dmarkers.jpg",
													value: "v2_point_clustered_3dmarkers"
												}
											]
								},
								{
									//label: "Gauge",
									label: RV_RES.IDS_JS_CHART_GAUGE,
									image: "images/dialog/displayOptionsDialog/type_icons/gauge.gif",
									options: [
												{
													//label: "Dial Gauge",
													label: RV_RES.IDS_JS_CHART_DIAL_GAUGE,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_gauge_dial.gif",
													value: "gauge_dial"
												},
												{
													//label: "Dial Gauge",
													label: RV_RES.IDS_JS_CHART_DIAL_GAUGE,
													Description: "",
													image: "images/dialog/displayOptionsDialog/chart_thumbnails/type_v2_gauge.gif",
													value: "v2_gauge"
												}
											]
								}
							];
	},

	getDisplayTypeDialogDefinition: function( targetTypes )
	{
		var newDialogDefinition = [];

		for ( var j in this.m_displayTypeDialogDefinition )
		{
			var chartGroup = this.m_displayTypeDialogDefinition[j];
			var newChartGroup = {};
			newChartGroup.image = this.m_displayTypeDialogDefinition[j].image;
			newChartGroup.label = this.m_displayTypeDialogDefinition[j].label;
			newChartGroup.options = [];

			var charts = chartGroup.options;
			for( var k in charts)
			{
				var chart = charts[k];
				for( var i in targetTypes)
				{
					var targetType = targetTypes[i];
					if(chart.value === targetType )
					{
						var chartCopy = {
								label : chart.label,
								Description : chart.Description,
								image : chart.image,
								value : "{targetType:'" + chart.value + "', label:'" + chart.label + "'}"
						};
						newChartGroup.options.push( chartCopy );
					}
				}
			}

			if( newChartGroup.options.length > 0)
			{
				newDialogDefinition.push( newChartGroup );
			}
		}

		return newDialogDefinition;
	}
});