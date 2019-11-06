<!DOCTYPE html>
<html>
<head>
	<?php echo $this->Html->charset(); ?>

	<title>Microblog 2</title>
	<?php echo $this->Html->css('App') ?>
	<?php echo $this->Html->css('Card') ?>
	<?php echo $this->Html->css('Form') ?>
	<?php echo $this->Html->css('scrollbar') ?>
	<link rel="stylesheet"
		crossorigin
		type="text/css"
		href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
</head>

<body>
	<div id="app"></div>
	<?= $this->Html->script('v-notifier'); ?>
	<?= $this->Html->script('bundle'); ?>
</body>
</html>