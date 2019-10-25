<!DOCTYPE html>
<html>
<head>
	<?php echo $this->Html->charset(); ?>

	<title>React Integrated CakePHP Application</title>
	<?php echo $this->Html->css('App') ?>
	<?php echo $this->Html->css('Card') ?>
	<?php echo $this->Html->css('Form') ?>
	<link rel="stylesheet" type="text/css" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
</head>

<body>
	<div id="app"></div>

	<?= $this->Html->script('bundle'); ?>
</body>
</html>