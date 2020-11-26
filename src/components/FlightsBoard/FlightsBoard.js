import * as React from 'react';
import * as go from 'gojs';
import { ReactDiagram } from 'gojs-react';

  export default class FlightsBoard extends React.Component {
    /**
     * Ref to keep a reference to the component, which provides access to the GoJS diagram via getDiagram().
     */
    diagramRef;

    constructor(props) {
      super(props);
      this.diagramRef = React.createRef();
    }

    /**
     * Get the diagram reference and add any desired diagram listeners.
     * Typically the same function will be used for each listener,
     * with the function using a switch statement to handle the events.
     * This is only necessary when you want to define additional app-specific diagram listeners.
     */
    componentDidMount() {
      if (!this.diagramRef.current) return;
      const diagram = this.diagramRef.current.getDiagram();
      if (diagram) {
        diagram.addDiagramListener('ChangedSelection', this.props.onDiagramEvent);
        diagram.addDiagramListener('ObjectDoubleClicked', this.props.onDiagramDoubleClicked);
      }
    }

    /**
     * Get the diagram reference and remove listeners that were added during mounting.
     * This is only necessary when you have defined additional app-specific diagram listeners.
     */
    componentWillUnmount() {
      if (!this.diagramRef.current) return;
      const diagram = this.diagramRef.current.getDiagram();
      if (diagram) {
        diagram.removeDiagramListener('ChangedSelection', this.props.onDiagramEvent);
        diagram.removeDiagramListener('ObjectDoubleClicked', this.props.onDiagramDoubleClicked);
      }
    }

    /**
     * Diagram initialization method, which is passed to the ReactDiagram component.
     * This method is responsible for making the diagram and initializing the model, any templates,
     * and maybe doing other initialization tasks like customizing tools.
     * The model's data should not be set here, as the ReactDiagram component handles that via the other props.
     */
    initDiagram() {
      const $ = go.GraphObject.make;
      // set your license key here before creating the diagram: go.Diagram.licenseKey = "...";
      // $ObjectDoubleClicked
      const diagram =
        $(go.Diagram,
          {
            'undoManager.isEnabled': true,  // must be set to allow for model change listening
            // 'undoManager.maxHistoryLength': 0,  // uncomment disable undo/redo functionality
            'clickCreatingTool.archetypeNodeData': { text: 'new node', color: 'lightblue' },
            // doubleClick: function(e) {
            //   var diag = e.diagram;
            //   var pt = diag.lastInput.documentPoint;
            //   var sc = 2.5;  // target scale
            //   var w = diag.viewportBounds.width * diag.scale / sc;
            //   var h = diag.viewportBounds.height * diag.scale / sc;
            //   var pos = new go.Point(pt.x - w/2, pt.y - h/2);  // target position
            //   var anim = new go.Animation();
            //   anim.easing = go.Animation.EaseLinear;
            //   anim.add(diag, "scale", diag.scale, sc);
            //   anim.add(diag, "position", diag.position, pos);
            //   anim.start();
            // },
            model: $(go.GraphLinksModel,
              {
                linkKeyProperty: 'key',  // IMPORTANT! must be defined for merges and data sync when using GraphLinksModel
                // positive keys for nodes
                makeUniqueKeyFunction: (m, data) => {
                  let k = data.key || 1;
                  while (m.findNodeDataForKey(k)) k++;
                  data.key = k;
                  return k;
                },
                // negative keys for links
                makeUniqueLinkKeyFunction: (m, data) => {
                  let k = data.key || -1;
                  while (m.findLinkDataForKey(k)) k--;
                  data.key = k;
                  return k;
                }
              })
          });

      // define a simple Node template
      diagram.nodeTemplate =
        $(go.Node, {doubleClick: function(e) {
          var diag = e.diagram;
          var pt = diag.lastInput.documentPoint;
          var sc = 2.5;  // target scale
          var w = diag.viewportBounds.width * diag.scale / sc;
          var h = diag.viewportBounds.height * diag.scale / sc;
          var pos = new go.Point(pt.x - w/2, pt.y - h/2);  // target position
          var anim = new go.Animation();
          anim.easing = go.Animation.EaseLinear;
          anim.add(diag, "scale", diag.scale, sc);
          anim.add(diag, "position", diag.position, pos);
          anim.start();
        },},'Auto',  // the Shape will go around the TextBlock
          new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
          $(go.Shape, 'RoundedRectangle',
            {
              name: 'SHAPE', fill: 'white', strokeWidth: 0,
              // set the port properties:
              portId: '', fromLinkable: true, toLinkable: true, cursor: 'pointer'
            },
            // Shape.fill is bound to Node.data.color
            new go.Binding('fill', 'color')),
          $(go.TextBlock,
            { margin: 8, editable: true, font: '400 .875rem Roboto, sans-serif' },  // some room around the text
            new go.Binding('text').makeTwoWay()
          )
        );

      // relinking depends on modelData
      diagram.linkTemplate =
        $(go.Link,
          new go.Binding('relinkableFrom', 'canRelink').ofModel(),
          new go.Binding('relinkableTo', 'canRelink').ofModel(),
          $(go.Shape),
          $(go.Shape, { toArrow: 'Standard' })
        );

      return diagram;
    }

    render() {
      return (
        <ReactDiagram
          ref={this.diagramRef}
          divClassName='diagram-component'
          initDiagram={this.initDiagram}
          nodeDataArray={this.props.nodeDataArray}
          linkDataArray={this.props.linkDataArray}
          modelData={this.props.modelData}
          onModelChange={this.props.onModelChange}
          skipsDiagramUpdate={this.props.skipsDiagramUpdate}
        />
      );
    }
  }