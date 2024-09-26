import React, { useEffect, useRef } from 'react';
import './index.css';
import { widget } from '../../charting_library';
import createDataFeed from '../../createDataFeed';

function getLanguageFromURL() {
	const regex = new RegExp('[\\?&]lang=([^&#]*)');
	const results = regex.exec(window.location.search);
	return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

export const TVChartContainer = (props) => {
	const chartContainerRef = useRef();

    const {token} = props

	const defaultProps = {
		symbol: token?.symbol,
		interval: '1',
		has_intraday: true,
		libraryPath: '/charting_library/',
		visible_plots_set:true,
		datafeed: createDataFeed(token),
		theme: 'Dark',
		fullscreen: false,
		height: props.height, // Add the height prop
		width: props.width, // Add the width prop
	};

	useEffect(() => {
		const widgetOptions = {
			symbol: defaultProps.symbol,
			// debug: true,
			// BEWARE: no trailing slash is expected in feed URL
			// datafeed: new window.Datafeeds.UDFCompatibleDatafeed(defaultProps.datafeedUrl),
			datafeed: defaultProps.datafeed,
			interval: defaultProps.interval,
			container: chartContainerRef.current,
			library_path: defaultProps.libraryPath,
			theme: defaultProps.theme,
			fullscreen: defaultProps.fullscreen,
			height: defaultProps.height, // Pass the height prop
			width: defaultProps.width, 
		};

		// const tvWidget = new window.TradingView.widget(widgetOptions);
		const tvWidget = new widget(widgetOptions);

		tvWidget.onChartReady(() => {
			tvWidget.headerReady().then(() => {
				const button = tvWidget.createButton();
				button.setAttribute('title', 'Click to show a notification popup');
				button.classList.add('apply-common-tooltip');
				button.addEventListener('click', () => tvWidget.showNoticeDialog({
					title: 'Notification',
					body: 'TradingView Charting Library API works correctly',
					callback: () => {
						console.log('Noticed!');
					},
				}));
				// button.innerHTML = 'Check API';
			});
		});

		return () => {
			tvWidget.remove();
		};
	}, [props?.symbol]);

	return (
		<div
			ref={chartContainerRef}
			className={'TVChartContainer'}
		/>
	);
}
