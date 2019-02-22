export const flowChartController = (req, res) => {
	res.render('common', {
		pageTitle: 'Login',
		jsPath: '/build/bundle.flowChart.js'
	});
}