#!/bin/bash
set -e
set -x

: ${KERNEL_LOCATION:="`dirname $0`/../../linux"}
: ${CHROOT_LOCATION:="`dirname $0`/../../chroots/${DIST}_${ARCH}"}

# Trigger chroot building if it is not properly setup
if ! [[ -e "${CHROOT_LOCATION}.setup" ]]
then
	export COMMAND=":"
	export DIST ARCH
	`dirname $0`/exec_dist_arch.sh
fi

KERNEL_LOCATION_IN_CHROOT=/usr/local/src/linux
mkdir -p $CHROOT_LOCATION/$KERNEL_LOCATION_IN_CHROOT

sudo mount --bind $KERNEL_LOCATION $CHROOT_LOCATION/$KERNEL_LOCATION_IN_CHROOT

function cleanup {
	sudo umount -l $CHROOT_LOCATION/$KERNEL_LOCATION_IN_CHROOT
}
trap cleanup INT TERM QUIT EXIT

export COMMAND="export DIST=$DIST ARCH=$ARCH KERN_SRC=$KERNEL_LOCATION_IN_CHROOT && ./scripts/build_tw5864_kernel.sh"
export DIST ARCH
`dirname $0`/exec_dist_arch.sh
