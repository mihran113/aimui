import './ContextBox.less';

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Color from 'color';
import moment from 'moment';

import HubMainScreenContext from '../../HubMainScreenContext/HubMainScreenContext';
import { buildUrl, classNames } from '../../../../../utils';
import UI from '../../../../../ui';
import { HUB_PROJECT_EXPERIMENT } from '../../../../../constants/screens';


class ContextBox extends Component {
  handleRowMove = (runHash, metricName, traceContext) => {
    const focusedCircle = this.context.chart.focused.circle;
    const focusedMetric = this.context.chart.focused.metric;

    if (focusedCircle.active) {
      return;
    }

    if (focusedMetric.runHash === runHash && focusedMetric.metricName === metricName
      && focusedMetric.traceContext === traceContext) {
      return;
    }

    this.context.setChartFocusedState({
      metric: {
        runHash,
        metricName,
        traceContext,
      },
    });
  };

  handleRowClick = (runHash, metricName, traceContext) => {
    const focusedCircle = this.context.chart.focused.circle;
    let step = this.context.chart.focused.step;

    if (focusedCircle.runHash === runHash && focusedCircle.metricName === metricName
      && focusedCircle.traceContext === traceContext) {
      this.context.setChartFocusedState({
        step: step || 0,
        circle: {
          active: false,
          runHash: null,
          metricName: null,
          traceContext: null,
          step: null,
        },
      });
      return;
    }

    const line =  this.context.getTraceData(runHash, metricName, traceContext);
    if (line === null || line.data === null || !line.data.length) {
      return;
    }

    const point = this.context.getMetricStepDataByStepIdx(line.data, step);

    if (point === null) {
      // Select last point
      step = line.data[line.data.length-1][1];
    }

    this.context.setChartFocusedState({
      step: step,
      circle: {
        active: true,
        runHash: runHash,
        metricName: metricName,
        traceContext: traceContext,
        step: step,
      },
      metric: {
        runHash: null,
        metricName: null,
        traceContext: null,
      },
    });
  };

  formatValue = (v) => {
    return v ? Math.round(v * 10e6) / 10e6 : 0;
  };

  _renderRow = (run, metric, trace) => {
    const step = this.context.chart.focused.step;
    const contextHash = this.context.contextToHash(trace.context);

    const line = this.context.getTraceData(run.run_hash, metric.name, contextHash);

    let stepData = null;
    stepData = this.context.getMetricStepDataByStepIdx(line.data, step);
    // if (line.data.length > 0 && step > line.data[line.data.length-1][1]) {
    //   stepData = this.context.getMetricStepDataByStepIdx(line.data, line.data[line.data.length-1][1]);
    // } else {
    //   stepData = this.context.getMetricStepDataByStepIdx(line.data, step);
    // }

    const color = this.context.getMetricColor(line.run, line.metric, line.trace);
    const colorObj = Color(color);

    const focusedCircle = this.context.chart.focused.circle;
    const focusedMetric = this.context.chart.focused.metric;
    let active = false;
    if ((
      focusedCircle.runHash === run.run_hash
      && focusedCircle.metricName === metric.name
      && focusedCircle.traceContext === contextHash)
      || (
        focusedMetric.runHash === run.run_hash
      && focusedMetric.metricName === metric.name
      && focusedMetric.traceContext === contextHash)) {
      active = true;
    }

    const className = classNames({
      ContextBox__table__item: true,
      active: active,
    });

    let style = {};
    if (active) {
      style = {
        borderLeftColor: color,
        backgroundColor: colorObj.alpha(0.15).hsl().string(),
      };
    }

    // if (!this.context.isTFSummaryScalar(lineData)) {
    //   return null;
    // }

    return (
      <tr
        className={className}
        style={style}
        key={`${run.run_hash}/${metric.name}/${contextHash}`}
        onMouseMove={() => this.handleRowMove(run.run_hash, metric.name, contextHash)}
        onClick={() => this.handleRowClick(run.run_hash, metric.name, contextHash)}
      >
        <td>
          <div
            className='ContextBox__table__item__run'
            style={{
              color: color,
            }}
          >
            <div className='ContextBox__table__item__tag__dot' style={{ backgroundColor: color }} />
            {this.context.isTFSummaryScalar(run)
              ? this._renderTFRowName(metric)
              : this._renderAimRowName(run, metric, trace)
            }
          </div>
        </td>
        <td>
          {stepData !== null && stepData[0] !== null ? this.formatValue(stepData[0]) : '-'}
        </td>
        <td>
          {stepData !== null && stepData[1] !== null ? stepData[1] : '-'}
        </td>
        <td>
          {stepData !== null && stepData[2] !== null ? stepData[2] : '-'}
        </td>
        <td>
          {stepData !== null && stepData[3] !== null ? moment.unix(stepData[3]).format('HH:mm:ss · D MMM, YY') : '-'}
        </td>
        <td>
          {this._renderRowParams(run.params) || '-'}
        </td>
      </tr>
    );
  };

  _renderAimRowName = (run, metric, trace) => {
    return (
      <Link
        className='ContextBox__table__item__name'
        to={buildUrl(HUB_PROJECT_EXPERIMENT, {
          experiment_name: run.experiment_name,
          commit_id: run.run_hash,
        })}
      >
        {run.experiment_name}/
        {metric.name}
        {!!trace.context &&
        <>
          {' ['}
          <div className='ContextBox__table__item__context'>
            {Object.keys(trace.context).map((contextCat, contextCatKey) =>
              <UI.Text inline key={contextCatKey}>{contextCat}: {trace.context[contextCat]}</UI.Text>
            )}
          </div>
          {']'}
        </>
        }
      </Link>
    )
  };

  _renderTFRowName = (metric) => {
    return (
      <>TF:{metric.name}</>
    )
  };

  _renderRowParams = (param, paramName) => {
    if (Array.isArray(param)) {
      return <UI.Text>{paramName}={JSON.stringify(param)}</UI.Text>
    } else if (typeof param === 'boolean') {
      return <UI.Text>{paramName}={param ? 'true' : 'false'}</UI.Text>
    } else if (typeof param === 'object') {
      if (Object.keys(param).length === 0) {
        return null;
      }

      return (
        <div className='ContextBox__param__items'>
          {!!paramName &&
          <UI.Text className='ContextBox__param__items__name'>{paramName}:</UI.Text>
          }
          {Object.keys(param).map((paramName, paramValKey) =>
            <div
              className='ContextBox__param__item'
              key={paramValKey}
            >
              {this._renderRowParams(param[paramName], paramName)}
            </div>
          )}
        </div>
      )
    } else {
      return <UI.Text>{paramName}={param}</UI.Text>
    }
  };

  _renderRows = () => {
    return (
      <>
        {this.context.runs.data.map((run) =>
          run.metrics.map((metric) =>
            metric.traces.map((trace) =>
              this._renderRow(run, metric, trace)
            )
          )
        )}
      </>
    );
  };

  _renderContent = () => {
    if (this.context.runs.isLoading) {
      return <UI.Text type='grey' center spacingTop>Loading..</UI.Text>
    }

    if (this.context.runs.isEmpty || !this.context.runs.data.length) {
      return null;
    }

    return (
      <div className='ContextBox__content'>
        <div className='ContextBox__table__wrapper'>
          <table className='ContextBox__table' cellSpacing={0} cellPadding={0}>
            <tbody>
              <tr className='ContextBox__table__topheader'>
                <td>
                  <UI.Text overline bold>Metric</UI.Text>
                </td>
                <td>
                  <UI.Text overline bold>Value</UI.Text>
                </td>
                <td>
                  <UI.Text overline bold>Step</UI.Text>
                </td>
                <td>
                  <UI.Text overline bold>Epoch</UI.Text>
                </td>
                <td>
                  <UI.Text overline bold>Time</UI.Text>
                </td>
                <td>
                  <UI.Text overline bold>Parameters</UI.Text>
                </td>
              </tr>
              {this._renderRows()}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  render() {
    return (
      <div className='ContextBox' style={{
        width: `${this.props.width}px`,
      }}>
        {this._renderContent()}
      </div>
    );
  }
}

ContextBox.propTypes = {};

ContextBox.contextType = HubMainScreenContext;

export default ContextBox;