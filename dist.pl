#!/usr/bin/env perl

use strict;
use warnings;

my $usage = <<USAGE;
$0 <version> <os>

Examples:
$0 0.1 Linux
$0 0.1 Mac
$0 0.1 Windows
USAGE

sub main {
    my ($version, $os) = @ARGV;
    if (check_args($version, $os)) {
        my $release_for_windows = 0;
        if ($os eq "Windows") {
            die("Must have agrippad.exe under project directory.") unless -s "agrippad.exe";
            $release_for_windows = 1;
        }

        my $distdir = "Agrippa-$version.$os";
        system("rm -rf $distdir");
        mkdir($distdir);

        my $os_lc = lc($os);
        system("cp README.md $distdir/");
        system("cp config.template.$os_lc.yaml $distdir/config.yaml");

        chdir("client");
        system("cp -R web ../$distdir/");   # No trailing slash for web!  It matters on MacOS/BSD.

        if ($release_for_windows) {
            chdir("../");
            system("touch agrippad.exe");
            system("mv agrippad.exe $distdir/");
            system("zip -r $distdir.zip $distdir")
        } else {
            chdir("../server/");
            system("stack --local-bin-path ../$distdir build --copy-bins");
            chdir("../");
            system("tar -czf $distdir.tar.gz $distdir");
        }

    } else {
        print STDERR ($usage);
        exit(1);
    }
}

sub check_args {
    my $version = shift(@_);
    my $os = shift(@_);
    return defined($version) && defined($os) && $version =~ /^\d+(\.\d+)*$/ && $os =~ /^(Linux|Mac|Windows)$/;
}

main();
